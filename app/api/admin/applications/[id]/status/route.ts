import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// ✅ Allow the new statuses as well
const VALID_STATUSES = [
  "new",
  "contacted",
  "interview",
  "hired",
  "rejected",
  "shortlisted",
  "task_sent",
];

/**
 * PATCH /api/admin/applications/[id]/status
 * Updates the status of a given application record and returns the updated row.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE credentials" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const status = body?.status as string | undefined;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("applications")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  return new NextResponse(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
