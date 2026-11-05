// Legion logger: ISO | level | module | message, daily file, 7 files / 5 MB rotation.
const fs = require('fs');
const path = require('path');

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 7;

let logDir = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

function init(dir) {
  logDir = dir;
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.warn('[logger] cannot create log dir:', e.message);
  }
  rotateOld();
}

function rotateOld() {
  try {
    const files = fs
      .readdirSync(logDir)
      .filter((f) => /^legion-\d{8}(-\d+)?\.log$/.test(f))
      .sort();
    while (files.length >= MAX_FILES) {
      fs.unlinkSync(path.join(logDir, files.shift()));
    }
  } catch {
    // rotation is best-effort; never break the app on log housekeeping
  }
}

function currentFile() {
  const d = new Date();
  const day = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  let file = path.join(logDir, `legion-${day}.log`);
  try {
    if (fs.existsSync(file) && fs.statSync(file).size >= MAX_BYTES) {
      let n = 1;
      while (true) {
        const candidate = path.join(logDir, `legion-${day}-${n}.log`);
        if (!fs.existsSync(candidate) || fs.statSync(candidate).size < MAX_BYTES) {
          file = candidate;
          break;
        }
        n += 1;
      }
    }
  } catch {
    // fall back to the plain daily file
  }
  return file;
}

function write(level, mod, msg) {
  if (!logDir) return;
  const line = `${new Date().toISOString()} | ${level} | ${mod} | ${msg}\n`;
  try {
    fs.appendFileSync(currentFile(), line);
  } catch (e) {
    console.warn('[logger] write failed:', e.message);
  }
}

module.exports = {
  init,
  info: (mod, msg) => write('INFO', mod, msg),
  warn: (mod, msg) => write('WARN', mod, msg),
  error: (mod, msg) => write('ERROR', mod, msg),
};
