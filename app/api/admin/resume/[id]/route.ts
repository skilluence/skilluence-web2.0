export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface AuditRow {
  id: number;
  resume_filename: string;
  resume_path?: string;
  resume_content_type?: string;
  resume_blob?: Buffer | Uint8Array | string | null;
}

function guessContentType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".txt")) return "text/plain";
  return "application/octet-stream";
}

function blobToBuffer(val: Buffer | Uint8Array | string | null | undefined): Buffer | null {
  if (!val) return null;
  if (Buffer.isBuffer(val)) return val;
  if (val instanceof Uint8Array) return Buffer.from(val.buffer, val.byteOffset, val.byteLength);
  if (typeof val === "string") {
    // PostgreSQL returns BYTEA as \xHEXDATA in text protocol
    const hex = val.startsWith("\\x") ? val.slice(2) : val;
    return Buffer.from(hex, "hex");
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const row = (await db
    .prepare("SELECT id, resume_filename, resume_path, resume_content_type, resume_blob FROM resume_audits WHERE id = ?")
    .get(id)) as AuditRow | undefined;

  if (!row) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  if (row.resume_blob) {
    const buf = blobToBuffer(row.resume_blob);
    if (buf && buf.byteLength > 0) {
      const contentType = row.resume_content_type || guessContentType(row.resume_filename);
      return new Response(new Uint8Array(buf.buffer as ArrayBuffer, buf.byteOffset, buf.byteLength), {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${row.resume_filename}"`,
        },
      });
    }
  }

  if (row.resume_path) {
    const fullPath = path.join(process.cwd(), row.resume_path);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const contentType = row.resume_content_type || guessContentType(row.resume_filename);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${row.resume_filename}"`,
        },
      });
    }
  }

  return NextResponse.json({ error: "Resume not available." }, { status: 404 });
}
