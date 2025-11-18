// app/api/admin/applications/send-task/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTaskEmail } from "@/lib/email";

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
 * POST /api/admin/applications/send-task
 * Body: {
 *   ids: string[],
 *   taskDescription: string,
 *   taskDeadline: string,
 *   taskLink?: string
 * }
 */
export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();

    const body = await req.json().catch(() => null);
    const ids = (body?.ids ?? []) as string[];
    const taskDescription = body?.taskDescription as string;
    const taskDeadline = body?.taskDeadline as string;
    const taskLink = body?.taskLink as string | undefined;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids supplied" }, { status: 400 });
    }

    if (!taskDescription || !taskDeadline) {
      return NextResponse.json(
        { error: "taskDescription and taskDeadline are required" },
        { status: 400 }
      );
    }

    // 1. Fetch the selected applications
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

    // 2. Send task emails
    if (applications) {
      await Promise.all(
        applications.map((a) =>
          sendTaskEmail({
            to: a.email,
            name: a.name,
            jobSlug: a.job_slug,
            taskDescription,
            taskDeadline,
            taskLink,
          }).catch((err) => {
            console.error("Failed to send task email", a.id, err);
          })
        )
      );
    }

    // 3. Update status
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        status: "task_sent",
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
