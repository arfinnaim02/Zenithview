// lib/email.ts
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set. Check your .env.local");
}

const resend = new Resend(resendApiKey);

function prettyJobTitle(jobSlug?: string | null) {
  if (!jobSlug) return "your applied position";
  return jobSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------------------------------------------------------
// SHORTLIST INTERVIEW EMAIL
// ---------------------------------------------------------
export async function sendShortlistEmail(opts: {
  to: string;
  name: string;
  jobSlug?: string | null;
  interviewDate: string;
  interviewTime: string;
  meetingLink: string;
}) {
  const jobTitle = prettyJobTitle(opts.jobSlug);

  // Your actual logo file
  const logoUrl = "/logos/company logo.png";
  const platform = "Google Meet";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222; max-width: 650px; margin: auto; padding: 20px;">

      <div style="text-align: center; margin-bottom: 25px;">
        <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px;" />
      </div>

      <p>Dear <b>${opts.name}</b>,</p>

      <p>
        Thank you for your interest in joining 
        <b>Zenithview Ltd.</b> We are pleased to inform you that
        you have been <b>shortlisted for the 1st online interview</b> for the
        position of <b>${jobTitle}</b>.
      </p>

      <h3 style="margin-top: 20px; margin-bottom: 8px; color: #111;">
        Interview Details:
      </h3>

      <p><b>Date:</b> ${opts.interviewDate}</p>
      <p><b>Time:</b> ${opts.interviewTime} (Bangladesh Time)</p>
      <p><b>Platform:</b> ${platform}</p>

      <p>
        <b>Meeting Link:</b><br/>
        <a href="${opts.meetingLink}" target="_blank" style="color:#2563eb; font-size: 15px;">
          ${opts.meetingLink}
        </a>
      </p>

      <p>
        Please ensure a stable internet connection and a quiet environment during 
        the interview. If you face any issues, feel free to contact us at 
        <b>+880 1734-081581</b>.
      </p>

      <p>
        We look forward to speaking with you and learning more about your skills 
        and experience.
      </p>

      <br/>

      <p>Best regards,</p>
      <p><b>HR & Admin Department</b></p>
      <p>hr@zenithview.com</p>
      <p>+880 1734-081581</p>
      <p><b>Zenithview Ltd.</b></p>

    </div>
  `;

  const result = await resend.emails.send({
    from: "ZenithView HR <onboarding@resend.dev>",
    to: opts.to,
    subject: `Interview Invitation - ${jobTitle}`,
    html,
  });

  console.log("Resend shortlist result:", result);
}

// ---------------------------------------------------------
// TASK EMAIL
// ---------------------------------------------------------
export async function sendTaskEmail(opts: {
  to: string;
  name: string;
  jobSlug?: string | null;
  taskDescription: string;
  taskDeadline: string;
  taskLink?: string;
}) {
  const jobTitle = prettyJobTitle(opts.jobSlug);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222; max-width: 650px; margin: auto; padding: 20px;">
      <p>Dear ${opts.name},</p>

      <p>Thank you for applying for the <b>${jobTitle}</b> role.</p>

      <p><b>Here is your task:</b></p>

      <p><b>Description:</b><br/> ${opts.taskDescription}</p>
      <p><b>Deadline:</b> ${opts.taskDeadline}</p>

      ${
        opts.taskLink
          ? `<p><b>Task Link:</b><br/>
              <a href="${opts.taskLink}" target="_blank" style="color:#2563eb;">
                ${opts.taskLink}
              </a></p>`
          : ""
      }

      <p>Please submit your work before the deadline.</p>

      <br/>

      <p>Best regards,</p>
      <p><b>HR & Admin Department</b></p>
      <p>hr@zenithview.com</p>
      <p>+880 1734-081581</p>
      <p><b>Zenithview Ltd.</b></p>

    </div>
  `;

  const result = await resend.emails.send({
    from: "ZenithView HR <onboarding@resend.dev>",
    to: opts.to,
    subject: `Task for ${jobTitle} application`,
    html,
  });

  console.log("Resend task result:", result);
}
