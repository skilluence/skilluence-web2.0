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

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const jobs = (await db
    .prepare(
      "SELECT id, title, department, shift, description, location, schedule, experience, icon, active, created_at, updated_at FROM job_listings ORDER BY created_at DESC"
    )
    .all()) as unknown[];

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as JobListingInput;
  const input = normalizeInput(body);

  if (!input.title || !input.department || !input.shift || !input.description || !input.location || !input.schedule || !input.experience) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  await db.prepare(
    `INSERT INTO job_listings (title, department, shift, description, location, schedule, experience, icon, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(input.title, input.department, input.shift, input.description, input.location, input.schedule, input.experience, input.icon, input.active ? 1 : 0);

  return NextResponse.json({ ok: true });
}
