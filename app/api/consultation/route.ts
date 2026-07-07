import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, subject } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  await db.prepare(`
    INSERT INTO contact_submissions (source, name, email, phone, subject)
    VALUES ('consultation', ?, ?, ?, ?)
  `).run(
    name.trim(),
    email.trim(),
    phone?.trim() || null,
    subject?.trim() || null,
  );

  return NextResponse.json({ ok: true });
}
