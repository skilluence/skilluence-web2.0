import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE
    ? `postgres://${encodeURIComponent(process.env.PGUSER)}:${encodeURIComponent(
        process.env.PGPASSWORD
      )}@${process.env.PGHOST}:${process.env.PGPORT ?? 5432}/${process.env.PGDATABASE}`
    : undefined);

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "skilluence.db");

type DbClient = {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => {
    run: (...params: unknown[]) => Promise<unknown>;
    all: (...params: unknown[]) => Promise<unknown[]>;
    get: (...params: unknown[]) => Promise<unknown>;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __db: DbClient | undefined;
}

function toPostgresSql(sql: string) {
  let counter = 0;
  return sql.replace(/\?/g, () => `$${++counter}`);
}

function sqliteDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      source      TEXT    NOT NULL CHECK(source IN ('contact', 'consultation')),
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT,
      service     TEXT,
      subject     TEXT,
      message     TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resume_audits (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_filename     TEXT    NOT NULL,
      resume_path         TEXT    NOT NULL,
      resume_content_type TEXT,
      resume_blob         BLOB,
      job_description     TEXT    NOT NULL,
      overall_score       INTEGER NOT NULL,
      match_summary       TEXT    NOT NULL,
      category_scores     TEXT    NOT NULL,
      strengths           TEXT    NOT NULL,
      gaps                TEXT    NOT NULL,
      recommended_fixes   TEXT    NOT NULL,
      missing_keywords    TEXT    NOT NULL,
      created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      job_title           TEXT    NOT NULL,
      name                TEXT    NOT NULL,
      email               TEXT    NOT NULL,
      phone               TEXT    NOT NULL,
      resume_filename     TEXT    NOT NULL,
      resume_path         TEXT    NOT NULL,
      resume_content_type TEXT,
      resume_blob         BLOB,
      created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_listings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      department  TEXT    NOT NULL,
      shift       TEXT    NOT NULL,
      description TEXT    NOT NULL,
      location    TEXT    NOT NULL,
      schedule    TEXT    NOT NULL,
      experience  TEXT    NOT NULL,
      icon        TEXT    NOT NULL DEFAULT 'Briefcase',
      active      INTEGER NOT NULL DEFAULT 1,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const tableInfo = (table: string) =>
    db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;

  const addColumnIfMissing = (table: string, column: string, definition: string) => {
    const columns = tableInfo(table).map((row) => row.name);
    if (!columns.includes(column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  };

  addColumnIfMissing("resume_audits", "resume_content_type", "TEXT");
  addColumnIfMissing("resume_audits", "resume_blob", "BLOB");
  addColumnIfMissing("job_applications", "resume_content_type", "TEXT");
  addColumnIfMissing("job_applications", "resume_blob", "BLOB");

  const existingJobListings = db.prepare(`SELECT COUNT(*) AS c FROM job_listings`).get() as { c: number };
  if (!existingJobListings.c) {
    const seedJobs = [
      [
        "AI/ML Trainer",
        "AI/ML",
        "Full Time",
        "Deliver AI/ML training programs, guiding students through core concepts and practical applications in a dynamic learning environment.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in AI/ML",
        "BrainCircuit",
        1,
      ],
      [
        "Data Analyst",
        "Data",
        "Full Time",
        "Analyze data sets to provide insights, create reports, and support decision-making processes for our educational programs.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Data Analysis",
        "BarChart3",
        1,
      ],
      [
        "Software Developer",
        "Engineering",
        "Full Time",
        "Develop and maintain software applications, collaborate on projects, and contribute to the technical infrastructure of our platform.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Software Development",
        "Code",
        1,
      ],
      [
        "Data Engineer",
        "Engineering",
        "Full Time",
        "Design and manage data pipelines, ensure data quality, and support analytics initiatives across the organization.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Data Engineering",
        "Database",
        1,
      ],
      [
        "Technical Recruiter",
        "Recruiting",
        "Full Time",
        "Manage recruitment processes, source candidates, coordinate interviews, and build talent pipelines for technical roles.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Recruiting",
        "Users",
        1,
      ],
      [
        "Business Development Executive",
        "BizDev",
        "Full Time",
        "Drive business growth by identifying opportunities, building partnerships, and expanding our market presence.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Business Development",
        "Handshake",
        1,
      ],
    ];

    const insertJob = db.prepare(`
      INSERT INTO job_listings (title, department, shift, description, location, schedule, experience, icon, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const job of seedJobs) {
      insertJob.run(...job);
    }
  }

  return {
    exec: async (sql: string) => {
      db.exec(sql);
    },
    prepare: (sql: string) => {
      const statement = db.prepare(sql);
      return {
        run: async (...params: unknown[]) => statement.run(...params),
        all: async (...params: unknown[]) => statement.all(...params),
        get: async (...params: unknown[]) => statement.get(...params),
      };
    },
  };
}

async function initPostgres() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      source TEXT NOT NULL CHECK (source IN ('contact', 'consultation')),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT,
      subject TEXT,
      message TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resume_audits (
      id SERIAL PRIMARY KEY,
      resume_filename TEXT NOT NULL,
      resume_path TEXT NOT NULL,
      resume_content_type TEXT,
      resume_blob BYTEA,
      job_description TEXT NOT NULL,
      overall_score INTEGER NOT NULL,
      match_summary TEXT NOT NULL,
      category_scores TEXT NOT NULL,
      strengths TEXT NOT NULL,
      gaps TEXT NOT NULL,
      recommended_fixes TEXT NOT NULL,
      missing_keywords TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id SERIAL PRIMARY KEY,
      job_title TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      resume_filename TEXT NOT NULL,
      resume_path TEXT NOT NULL,
      resume_content_type TEXT,
      resume_blob BYTEA,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_listings (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      shift TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      schedule TEXT NOT NULL,
      experience TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'Briefcase',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`ALTER TABLE resume_audits ADD COLUMN IF NOT EXISTS resume_content_type TEXT`);
  await pool.query(`ALTER TABLE resume_audits ADD COLUMN IF NOT EXISTS resume_blob BYTEA`);
  await pool.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_content_type TEXT`);
  await pool.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_blob BYTEA`);

  const existingRows = await pool.query(`SELECT COUNT(*) AS c FROM job_listings`);
  const existingCount = parseInt(existingRows.rows[0]?.c ?? "0", 10);
  if (!existingCount) {
    const seedJobs = [
      [
        "AI/ML Trainer",
        "AI/ML",
        "Full Time",
        "Deliver AI/ML training programs, guiding students through core concepts and practical applications in a dynamic learning environment.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in AI/ML",
        "BrainCircuit",
        true,
      ],
      [
        "Data Analyst",
        "Data",
        "Full Time",
        "Analyze data sets to provide insights, create reports, and support decision-making processes for our educational programs.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Data Analysis",
        "BarChart3",
        true,
      ],
      [
        "Software Developer",
        "Engineering",
        "Full Time",
        "Develop and maintain software applications, collaborate on projects, and contribute to the technical infrastructure of our platform.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Software Development",
        "Code",
        true,
      ],
      [
        "Data Engineer",
        "Engineering",
        "Full Time",
        "Design and manage data pipelines, ensure data quality, and support analytics initiatives across the organization.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Data Engineering",
        "Database",
        true,
      ],
      [
        "Technical Recruiter",
        "Recruiting",
        "Full Time",
        "Manage recruitment processes, source candidates, coordinate interviews, and build talent pipelines for technical roles.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Recruiting",
        "Users",
        true,
      ],
      [
        "Business Development Executive",
        "BizDev",
        "Full Time",
        "Drive business growth by identifying opportunities, building partnerships, and expanding our market presence.",
        "Austin, TX",
        "Remote/Onsite · Full Time",
        "1+ Years in Business Development",
        "Handshake",
        true,
      ],
    ];

    for (const job of seedJobs) {
      await pool.query(
        `INSERT INTO job_listings (title, department, shift, description, location, schedule, experience, icon, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        job
      );
    }
  }

  return {
    exec: async (sql: string) => {
      await pool.query(sql);
    },
    prepare: (sql: string) => {
      const text = toPostgresSql(sql);
      return {
        run: async (...params: unknown[]) => {
          await pool.query(text, params);
        },
        all: async (...params: unknown[]) => {
          const result = await pool.query(text, params);
          return result.rows;
        },
        get: async (...params: unknown[]) => {
          const result = await pool.query(text, params);
          return result.rows[0];
        },
      };
    },
  };
}

let __dbPromise: Promise<DbClient> | undefined;

function getDb(): Promise<DbClient> {
  if (globalThis.__db) return Promise.resolve(globalThis.__db);
  if (!__dbPromise) {
    __dbPromise = (DATABASE_URL ? initPostgres() : Promise.resolve(sqliteDb())).then((client) => {
      if (process.env.NODE_ENV !== "production") globalThis.__db = client;
      return client;
    });
  }
  return __dbPromise;
}

const db: DbClient = {
  exec: async (sql: string) => {
    const client = await getDb();
    return client.exec(sql);
  },
  prepare: (sql: string) => ({
    run: async (...params: unknown[]) => {
      const client = await getDb();
      return client.prepare(sql).run(...params);
    },
    all: async (...params: unknown[]) => {
      const client = await getDb();
      return client.prepare(sql).all(...params);
    },
    get: async (...params: unknown[]) => {
      const client = await getDb();
      return client.prepare(sql).get(...params);
    },
  }),
};

export default db;
