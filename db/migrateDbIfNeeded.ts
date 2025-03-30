import { SQLiteDatabase } from "expo-sqlite";
import { CREATE_SPACES_TABLE } from "./tables/spaces/createSpacesTable";
import { CREATE_TASKS_TABLE } from "./tables/tasks/createTasksTable";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // Bump this to 2 (or higher) to reflect your new schema version
  const DATABASE_VERSION = 2;

  // Check current version
  const user = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = user?.user_version ?? 0;

  // Early exit if already on the latest schema
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // If the database is brand new (version 0), just create the new schema from scratch
  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      ${CREATE_SPACES_TABLE}
      ${CREATE_TASKS_TABLE}
    `);
    currentDbVersion = 2; // or set directly to DATABASE_VERSION
  }

  // Migrate from version 1 => 2
  if (currentDbVersion === 1) {
    // Put all your migration steps in a single transaction if you’d like
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      BEGIN TRANSACTION;

      -- 1) Drop the old locations table if it exists
      DROP TABLE IF EXISTS locations;

      -- 2) Rename old spaces to spaces_old
      ALTER TABLE spaces RENAME TO spaces_old;

      -- 3) Create the new spaces table with parent_id
      CREATE TABLE spaces (
        id INTEGER PRIMARY KEY NOT NULL,
        parent_id INTEGER,
        name TEXT NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES spaces(id) ON DELETE CASCADE
      );

      -- 4) Copy over data from spaces_old -> spaces
      --    We have to match columns. If old 'spaces' had 'id', 'location_id', 'name',
      --    you can copy 'id' and 'name' directly. 'parent_id' will remain NULL by default.
      INSERT INTO spaces (id, name)
      SELECT id, name
      FROM spaces_old;

      -- 5) Drop old spaces
      DROP TABLE spaces_old;

      -- 6) If you need to remove columns from items (e.g. frequency, last_cleaned_at),
      --    rename items -> items_old
      ALTER TABLE items RENAME TO items_old;

      -- 7) Recreate items with your new desired schema
      CREATE TABLE items (
        id INTEGER PRIMARY KEY NOT NULL,
        space_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
      );

      -- 8) Copy only the columns you want to keep
      --    Suppose old items had (id, space_id, name, frequency, last_cleaned_at).
      --    We only want (id, space_id, name):
      INSERT INTO items (id, space_id, name)
      SELECT id, space_id, name
      FROM items_old;

      -- 9) Drop the old items table
      DROP TABLE items_old;

      COMMIT;
    `);

    currentDbVersion = 2;
  }

  // Finally, set user_version so we don't run migrations again
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
