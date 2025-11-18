import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendShortlistEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE credentials");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return supabase;
}

/**
 * POST /api/admin/applications/shortlist
 * Body: { ids: string[], interviewDate: string, interviewTime: string, meetingLink: string }
 */
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();

    const body = await req.json().catch(() => null);
    const ids = (body?.ids ?? []) as string[];
    const interviewDate = body?.interviewDate as string | undefined;
    const interviewTime = body?.interviewTime as string | undefined;
    const meetingLink = body?.meetingLink as string | undefined;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids supplied" }, { status: 400 });
    }

    if (!interviewDate || !interviewTime || !meetingLink) {
      return NextResponse.json(
        {
          error:
            "interviewDate, interviewTime and meetingLink are required",
        },
        { status: 400 }
      );
    }

    // 1. Fetch applications
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("id, name, email, job_slug")
      .in("id", ids);

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    // 2. Send emails
    if (applications) {
      await Promise.all(
        applications.map((a) =>
          sendShortlistEmail({
            to: a.email,
            name: a.name,
            jobSlug: a.job_slug,
            interviewDate,
            interviewTime,
            meetingLink,
          }).catch((err) => {
            console.error("Failed to send shortlist email", a.id, err);
          })
        )
      );
    }

    // 3. Update status
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        status: "shortlisted",
        updated_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
