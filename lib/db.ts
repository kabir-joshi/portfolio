import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// On Vercel, only /tmp is writable at runtime
const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
if (!process.env.VERCEL && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "submissions.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    session     TEXT    NOT NULL,
    date        TEXT,
    message     TEXT    NOT NULL,
    read        INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

export type Submission = {
  id: number;
  name: string;
  email: string;
  session: string;
  date: string | null;
  message: string;
  read: number;
  created_at: string;
};

export const insertSubmission = db.prepare<
  [string, string, string, string | null, string]
>(
  `INSERT INTO submissions (name, email, session, date, message)
   VALUES (?, ?, ?, ?, ?)`
);

export const getAllSubmissions = db.prepare<[], Submission>(
  `SELECT * FROM submissions ORDER BY created_at DESC`
);

export const markRead = db.prepare<[number], void>(
  `UPDATE submissions SET read = 1 WHERE id = ?`
);

export const deleteSubmission = db.prepare<[number], void>(
  `DELETE FROM submissions WHERE id = ?`
);

export default db;
