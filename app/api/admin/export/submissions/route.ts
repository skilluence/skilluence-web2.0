import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rows = (await db
    .prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    .all()) as Record<string, unknown>[];

  const data = rows.map((r) => ({
    ID: r.id,
    Source: r.source,
    Name: r.name,
    Email: r.email,
    Phone: r.phone ?? "",
    "Service / Subject": (r.service ?? r.subject) || "",
    Message: r.message ?? "",
    "Submitted At": r.created_at,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Submissions");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="submissions.xlsx"',
    },
  });
}
