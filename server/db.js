const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'careerloom.db');

// We wrap sql.js to provide a synchronous API similar to better-sqlite3
// so all route files work without changes.

let _db = null;

function saveDb() {
  if (_db) {
    const data = _db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

// Auto-save periodically and on process exit
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveDb();
    saveTimer = null;
  }, 1000);
}

process.on('exit', saveDb);
process.on('SIGINT', () => { saveDb(); process.exit(); });
process.on('SIGTERM', () => { saveDb(); process.exit(); });

// Statement wrapper to mimic better-sqlite3 Statement API
class StatementWrapper {
  constructor(db, sql) {
    this._db = db;
    this._sql = sql;
  }

  run(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    this._db.run(this._sql, flatParams);
    scheduleSave();
    // Return object with lastInsertRowid and changes
    const lastId = this._db.exec('SELECT last_insert_rowid() as id');
    const changes = this._db.getRowsModified();
    return {
      lastInsertRowid: lastId.length > 0 ? lastId[0].values[0][0] : 0,
      changes,
    };
  }

  get(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    try {
      const stmt = this._db.prepare(this._sql);
      stmt.bind(flatParams);
      if (stmt.step()) {
        const cols = stmt.getColumnNames();
        const vals = stmt.get();
        stmt.free();
        const row = {};
        cols.forEach((col, i) => { row[col] = vals[i]; });
        return row;
      }
      stmt.free();
      return undefined;
    } catch (e) {
      console.error('DB get() error:', e.message, '| SQL:', this._sql);
      return undefined;
    }
  }

  all(...params) {
    const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
    try {
      const results = this._db.exec(this._sql, flatParams);
      if (results.length === 0) return [];
      const { columns, values } = results[0];
      return values.map(row => {
        const obj = {};
        columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      });
    } catch (e) {
      console.error('DB all() error:', e.message, '| SQL:', this._sql);
      return [];
    }
  }
}

// DB wrapper to mimic better-sqlite3 Database API
class DbWrapper {
  constructor(sqliteDb) {
    this._db = sqliteDb;
  }

  prepare(sql) {
    return new StatementWrapper(this._db, sql);
  }

  exec(sql) {
    this._db.run(sql);
    scheduleSave();
  }

  pragma(pragmaStr) {
    try {
      this._db.run(`PRAGMA ${pragmaStr}`);
    } catch (e) {
      // Some pragmas may not be supported in sql.js
    }
  }

  transaction(fn) {
    return (...args) => {
      this._db.run('BEGIN TRANSACTION');
      try {
        fn(...args);
        this._db.run('COMMIT');
        scheduleSave();
      } catch (e) {
        this._db.run('ROLLBACK');
        throw e;
      }
    };
  }
}

// Synchronous initialization - we block on the promise using a global
// Since Node.js top-level await isn't available in CommonJS, we use a
// synchronous init pattern with a ready promise.

let _wrapper = null;
let _readyResolve;
const ready = new Promise((resolve) => { _readyResolve = resolve; });

(async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(fileBuffer);
  } else {
    _db = new SQL.Database();
  }

  _wrapper = new DbWrapper(_db);

  // Create tables
  _db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      current_role TEXT DEFAULT '',
      years_experience INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS skill_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      skill_name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 50,
      onet_code TEXT DEFAULT '',
      source TEXT DEFAULT 'assessment',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS career_paths (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      source_role TEXT NOT NULL,
      target_role TEXT NOT NULL,
      skill_overlap REAL DEFAULT 0,
      feasibility_score REAL DEFAULT 0,
      median_salary INTEGER DEFAULT 0,
      growth_rate REAL DEFAULT 0,
      market_demand TEXT DEFAULT 'Medium',
      skill_gaps TEXT DEFAULT '[]',
      transition_time_months INTEGER DEFAULT 6,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS learning_roadmaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      career_path_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      weeks_data TEXT NOT NULL DEFAULT '[]',
      progress TEXT NOT NULL DEFAULT '[]',
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (career_path_id) REFERENCES career_paths(id) ON DELETE CASCADE
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS session_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      details TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  _db.run(`
    CREATE TABLE IF NOT EXISTS saved_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_id TEXT NOT NULL,
      job_title TEXT NOT NULL,
      company TEXT DEFAULT '',
      status TEXT DEFAULT 'saved',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  _db.run('PRAGMA foreign_keys = ON');
  saveDb();

  _readyResolve(_wrapper);
})();

// Export the ready promise and a getter
module.exports = { ready, getDb: () => _wrapper };
