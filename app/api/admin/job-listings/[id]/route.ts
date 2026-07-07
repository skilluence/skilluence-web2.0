export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

interface JobListingInput {
  title: string;
  department: string;
  shift: string;
  description: string;
  location: string;
  schedule: string;
  experience: string;
  icon?: string;
  active?: boolean;
}

function normalizeInput(input: JobListingInput) {
  return {
    title: (input.title ?? "").trim(),
    department: (input.department ?? "").trim(),
    shift: (input.shift ?? "").trim(),
    description: (input.description ?? "").trim(),
    location: (input.location ?? "").trim(),
    schedule: (input.schedule ?? "").trim(),
    experience: (input.experience ?? "").trim(),
    icon: (input.icon ?? "Briefcase").trim() || "Briefcase",
    active: input.active === false ? false : true,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) {
    return NextResponse.json({ error: "Invalid job listing ID." }, { status: 400 });
  }

  const existing = await db.prepare("SELECT id FROM job_listings WHERE id = ?").get(listingId);
  if (!existing) {
    return NextResponse.json({ error: "Job posting not found." }, { status: 404 });
  }

  const body = (await request.json()) as JobListingInput;
  const input = normalizeInput(body);

  if (!input.title || !input.department || !input.shift || !input.description || !input.location || !input.schedule || !input.experience) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  await db.prepare(
    `UPDATE job_listings SET title = ?, department = ?, shift = ?, description = ?, location = ?, schedule = ?, experience = ?, icon = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).run(input.title, input.department, input.shift, input.description, input.location, input.schedule, input.experience, input.icon, input.active ? 1 : 0, listingId);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const listingId = Number(id);
  if (!listingId) {
    return NextResponse.json({ error: "Invalid job listing ID." }, { status: 400 });
  }

  const existing = await db.prepare("SELECT id FROM job_listings WHERE id = ?").get(listingId);
  if (!existing) {
    return NextResponse.json({ error: "Job posting not found." }, { status: 404 });
  }

  await db.prepare("DELETE FROM job_listings WHERE id = ?").run(listingId);

  return NextResponse.json({ ok: true });
}
