export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rows = (await db
    .prepare("SELECT * FROM job_applications ORDER BY created_at DESC")
    .all()) as Record<string, unknown>[];

  const data = rows.map((r) => ({
    ID: r.id,
    "Job Title": r.job_title,
    Name: r.name,
    Email: r.email,
    Phone: r.phone,
    "Resume Filename": r.resume_filename,
    "Resume Path": r.resume_path,
    "Applied At": r.created_at,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Job Applications");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="job-applications.xlsx"',
    },
  });
}
