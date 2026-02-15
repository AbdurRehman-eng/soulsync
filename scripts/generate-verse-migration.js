/**
 * Parses the two verse text files and generates a SQL migration
 * to insert all verses into the cards table and link mood verses
 * to their respective moods via card_moods.
 *
 * Usage: node scripts/generate-verse-migration.js
 */

const fs = require("fs");
const path = require("path");

const VERSES_DIR = path.join(__dirname, "..", "verses");
const OUTPUT_FILE = path.join(
  __dirname,
  "..",
  "supabase",
  "migrations",
  "20260215_seed_feed_verses.sql"
);

function escapeSQL(str) {
  if (!str) return "";
  return str.replace(/'/g, "''");
}

function escapeJSON(str) {
  if (!str) return "";
  // For JSON strings inside SQL: escape single quotes for SQL, and backslashes/quotes for JSON
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/\t/g, "\\t");
}

// ─── Parse 365 Daily Verses ───────────────────────────────────────
function parseDailyVerses() {
  const content = fs.readFileSync(
    path.join(VERSES_DIR, "365 - daily verses.txt"),
    "utf8"
  );

  const verses = [];
  // Match each tuple: (id, dayNumber, 'text', 'ref', 'status', 'devotional', 'prayer', 'date', 'date', 'note', 'fullVerse')
  // Handle both '' and \' escaped quotes
  const regex =
    /\((\d+),(\d+),'((?:[^'\\]|''|\\.)*?)','((?:[^'\\]|''|\\.)*?)','((?:[^'\\]|''|\\.)*?)','((?:[^'\\]|''|\\.)*?)','((?:[^'\\]|''|\\.)*?)','[^']*','[^']*','((?:[^'\\]|''|\\.)*?)','((?:[^'\\]|''|\\.)*?)'\)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    verses.push({
      id: parseInt(match[1]),
      dayNumber: parseInt(match[2]),
      text: match[3].replace(/''/g, "'").replace(/\\'/g, "'"),
      ref: match[4].replace(/''/g, "'").replace(/\\'/g, "'"),
      status: match[5].replace(/''/g, "'").replace(/\\'/g, "'"),
      devotional: match[6].replace(/''/g, "'").replace(/\\'/g, "'"),
      prayer: match[7].replace(/''/g, "'").replace(/\\'/g, "'"),
      note: match[8].replace(/''/g, "'").replace(/\\'/g, "'"),
      fullVerse: match[9].replace(/''/g, "'").replace(/\\'/g, "'"),
    });
  }

  console.log(`Parsed ${verses.length} daily verses`);
  return verses;
}

// ─── Parse Mood Verses (CSV) ─────────────────────────────────────
function parseMoodVerses() {
  const content = fs.readFileSync(
    path.join(VERSES_DIR, "db mood verses.txt"),
    "utf8"
  );

  const lines = content.split("\n").filter((l) => l.trim());
  // Skip header
  const verses = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // CSV with quoted fields - parse carefully
    const fields = parseCSVLine(line);
    if (fields.length < 12) continue;

    verses.push({
      id: parseInt(fields[0]),
      mood_category: fields[1],
      verse_key: fields[2],
      text: fields[3],
      fullVerse: fields[4],
      ref: fields[5],
      status: fields[6],
      devotional: fields[7],
      prayer: fields[8],
      createdAt: fields[9],
      updatedAt: fields[10],
      note: fields[11],
    });
  }

  console.log(`Parsed ${verses.length} mood verses`);
  return verses;
}

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// ─── Map mood categories to DB mood names ─────────────────────────
const MOOD_MAP = {
  anxious: "Anxious",
  sad: "Sad",
  lonely: "Lonely",
  joyful: "Happy",
  grateful: "Grateful",
  overwhelmed: "Anxious", // closest match; overwhelmed maps to Anxious
};

// ─── Generate SQL ─────────────────────────────────────────────────
function generateSQL(dailyVerses, moodVerses) {
  const lines = [];

  lines.push("-- ============================================");
  lines.push("-- MIGRATION: Seed Feed Verses");
  lines.push(
    `-- Generated: ${new Date().toISOString().split("T")[0]}`
  );
  lines.push(`-- Daily verses: ${dailyVerses.length}`);
  lines.push(`-- Mood verses: ${moodVerses.length}`);
  lines.push("-- ============================================");
  lines.push("");
  lines.push("BEGIN;");
  lines.push("");

  // ── Part 1: Daily Verses ──────────────────────────────────────
  lines.push("-- ============================================");
  lines.push("-- PART 1: 365 Daily Verses");
  lines.push("-- ============================================");
  lines.push("");

  // We'll use a temp table approach to track generated UUIDs for linking
  lines.push(
    "-- Temp table to track daily verse card IDs for linking"
  );
  lines.push(
    "CREATE TEMP TABLE _daily_verse_ids (day_number INT, card_id UUID);"
  );
  lines.push("");

  // Insert daily verses in batches
  const BATCH_SIZE = 50;
  for (let b = 0; b < dailyVerses.length; b += BATCH_SIZE) {
    const batch = dailyVerses.slice(b, b + BATCH_SIZE);
    lines.push(`-- Daily verses batch ${Math.floor(b / BATCH_SIZE) + 1}`);

    for (const v of batch) {
      const contentJSON = JSON.stringify({
        verse_text: v.fullVerse || v.text,
        verse_reference: v.ref,
        short_text: v.text,
        devotional: v.devotional,
        prayer: v.prayer,
        note: v.note,
        day_number: v.dayNumber,
      });

      const title = escapeSQL(`Day ${v.dayNumber} Verse`);
      const subtitle = escapeSQL(v.ref);
      const contentEscaped = escapeSQL(contentJSON);

      lines.push(`WITH ins AS (`);
      lines.push(
        `  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)`
      );
      lines.push(
        `  VALUES ('verse', '${title}', '${subtitle}', '${contentEscaped}', 5, true, NULL)`
      );
      lines.push(`  RETURNING id`);
      lines.push(`)`);
      lines.push(
        `INSERT INTO _daily_verse_ids (day_number, card_id) SELECT ${v.dayNumber}, id FROM ins;`
      );
    }
    lines.push("");
  }

  // Link daily verses to ALL moods with weight=1 (default)
  lines.push("-- Link daily verses to all active moods (weight=1)");
  lines.push(`INSERT INTO card_moods (card_id, mood_id, weight)`);
  lines.push(`SELECT dv.card_id, m.id, 1`);
  lines.push(`FROM _daily_verse_ids dv`);
  lines.push(`CROSS JOIN moods m`);
  lines.push(`WHERE m.is_active = true`);
  lines.push(`ON CONFLICT (card_id, mood_id) DO NOTHING;`);
  lines.push("");

  // ── Part 2: Mood Verses ───────────────────────────────────────
  lines.push("-- ============================================");
  lines.push("-- PART 2: Mood-Specific Verses");
  lines.push("-- ============================================");
  lines.push("");

  lines.push(
    "CREATE TEMP TABLE _mood_verse_ids (mood_category TEXT, card_id UUID);"
  );
  lines.push("");

  for (let b = 0; b < moodVerses.length; b += BATCH_SIZE) {
    const batch = moodVerses.slice(b, b + BATCH_SIZE);
    lines.push(`-- Mood verses batch ${Math.floor(b / BATCH_SIZE) + 1}`);

    for (const v of batch) {
      const contentJSON = JSON.stringify({
        verse_text: v.fullVerse || v.text,
        verse_reference: v.ref,
        short_text: v.text,
        devotional: v.devotional,
        prayer: v.prayer,
        note: v.note,
        mood_category: v.mood_category,
        verse_key: v.verse_key,
      });

      const title = escapeSQL(v.text.substring(0, 60));
      const subtitle = escapeSQL(v.ref);
      const contentEscaped = escapeSQL(contentJSON);
      const moodCat = escapeSQL(v.mood_category);

      lines.push(`WITH ins AS (`);
      lines.push(
        `  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)`
      );
      lines.push(
        `  VALUES ('verse', '${title}', '${subtitle}', '${contentEscaped}', 5, true, NULL)`
      );
      lines.push(`  RETURNING id`);
      lines.push(`)`);
      lines.push(
        `INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT '${moodCat}', id FROM ins;`
      );
    }
    lines.push("");
  }

  // Link mood verses to their PRIMARY mood with weight=5 (high affinity)
  lines.push("-- Link mood verses to their primary mood (weight=5)");
  for (const [csvMood, dbMood] of Object.entries(MOOD_MAP)) {
    lines.push(
      `INSERT INTO card_moods (card_id, mood_id, weight)`
    );
    lines.push(
      `SELECT mv.card_id, m.id, 5`
    );
    lines.push(`FROM _mood_verse_ids mv`);
    lines.push(
      `JOIN moods m ON m.name = '${dbMood}'`
    );
    lines.push(`WHERE mv.mood_category = '${csvMood}'`);
    lines.push(`ON CONFLICT (card_id, mood_id) DO NOTHING;`);
    lines.push("");
  }

  // Also link mood verses to ALL other moods with weight=1 (still available, just lower priority)
  lines.push(
    "-- Link mood verses to all other moods with lower weight (weight=1)"
  );
  lines.push(`INSERT INTO card_moods (card_id, mood_id, weight)`);
  lines.push(`SELECT mv.card_id, m.id, 1`);
  lines.push(`FROM _mood_verse_ids mv`);
  lines.push(`CROSS JOIN moods m`);
  lines.push(`WHERE m.is_active = true`);
  lines.push(`ON CONFLICT (card_id, mood_id) DO NOTHING;`);
  lines.push("");

  // Cleanup temp tables
  lines.push("-- Cleanup temp tables");
  lines.push("DROP TABLE IF EXISTS _daily_verse_ids;");
  lines.push("DROP TABLE IF EXISTS _mood_verse_ids;");
  lines.push("");

  lines.push("COMMIT;");
  lines.push("");

  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────
function main() {
  console.log("Parsing verse files...");
  const dailyVerses = parseDailyVerses();
  const moodVerses = parseMoodVerses();

  console.log("\nGenerating migration SQL...");
  const sql = generateSQL(dailyVerses, moodVerses);

  fs.writeFileSync(OUTPUT_FILE, sql, "utf8");
  console.log(`\nMigration written to: ${OUTPUT_FILE}`);
  console.log(
    `Total: ${dailyVerses.length} daily + ${moodVerses.length} mood = ${dailyVerses.length + moodVerses.length} verse cards`
  );
}

main();
