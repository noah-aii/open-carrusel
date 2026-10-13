import path from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { spawn, type ChildProcess } from "child_process";
import { Mutex } from "async-mutex";
import puppeteer, { type Browser } from "puppeteer";

export interface WebImageCandidate {
  thumb: string;
  full: string;
  fallback: string;
  alt: string;
}

const MAX_BYTES = 15 * 1024 * 1024;

// Persistent Chrome profile: the login done once in the visible window is reused by every search.
// Chrome locks a profile to one process, so every launch goes through this mutex.
const PROFILE_DIR = path.resolve(process.cwd(), "data/pinterest-profile");
const profileLock = new Mutex();
// The login window is a plain Chrome (no automation flags), otherwise Google rejects the sign-in.
// Real Google Chrome when installed: Google rejects sign-in on "Chrome for Testing" builds.
const REAL_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chromePath = () => (existsSync(REAL_CHROME) ? REAL_CHROME : puppeteer.executablePath());

let loginProc: ChildProcess | null = null;

async function launch(headless: boolean): Promise<Browser> {
  await mkdir(PROFILE_DIR, { recursive: true });
  return puppeteer.launch({
    headless,
    userDataDir: PROFILE_DIR, defaultViewport: null, executablePath: chromePath(),
    // Real keychain: the login window is a normal Chrome, so its cookies are encrypted with it.
    ignoreDefaultArgs: ["--use-mock-keychain", "--password-store=basic"],
  });
}

async function closeLoginWindow(): Promise<void> {
  const proc = loginProc;
  loginProc = null;
  if (!proc || proc.exitCode !== null) return;
  await new Promise<void>((resolve) => {
    proc.once("exit", () => resolve());
    proc.kill("SIGTERM"); // graceful: lets Chrome flush cookies to the profile
    setTimeout(resolve, 8000);
  });
}

/** Opens a visible, normal Chrome window on Pinterest's login page. The user types their own credentials. */
export async function openPinterestLogin(): Promise<void> {
  await profileLock.runExclusive(async () => {
    if (loginProc && loginProc.exitCode === null) return;
    await mkdir(PROFILE_DIR, { recursive: true });
    const proc = spawn(
      chromePath(),
      [`--user-data-dir=${PROFILE_DIR}`, "--no-first-run", "--no-default-browser-check", "https://br.pinterest.com/login/"],
      { stdio: "ignore" }
    );
    loginProc = proc;
    proc.on("exit", () => {
      if (loginProc === proc) loginProc = null;
    });
  });
}

/** Closes the login window (flushes cookies to the profile). */
export async function closePinterestLogin(): Promise<void> {
  await profileLock.runExclusive(closeLoginWindow);
}

export function isLoginWindowOpen(): boolean {
  return loginProc !== null && loginProc.exitCode === null;
}

/** Logged in = the search page no longer shows the sign-up wall. */
let cachedLoggedIn: boolean | null = null;

/** Last known login state, without touching Chrome (null = never checked). */
export function cachedLoginState(): { busy: boolean; loggedIn: boolean | null } {
  return { busy: profileLock.isLocked(), loggedIn: cachedLoggedIn };
}

export async function pinterestLoggedIn(): Promise<boolean> {
  return profileLock.runExclusive(async () => {
    if (isLoginWindowOpen()) return false; // window still open: cookies not flushed yet
    const browser = await launch(true);
    try {
      const page = await browser.newPage();
      await page.goto("https://br.pinterest.com/search/pins/?q=aesthetic", { waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {});
      await page.waitForSelector('img[src*="pinimg.com"]', { timeout: 10000 }).catch(() => {});
      // Logged-out pages show a sign-up wall; judge by what the page shows, not by cookies.
      const text = await page.evaluate(() => document.body.innerText);
      cachedLoggedIn = !/Você não entrou na conta|Criar conta|Sign up|Log in/i.test(text);
      return cachedLoggedIn;
    } finally {
      await browser.close();
    }
  });
}

/** Pinterest search using the saved login profile (works logged out too, with fewer results). Google Images blocks headless browsers (captcha), so it is not used. */
export async function searchPinterest(query: string, limit = 30): Promise<WebImageCandidate[]> {
  return profileLock.runExclusive(async () => {
    await closeLoginWindow();
    return runSearch(query, limit);
  });
}

async function runSearch(query: string, limit: number): Promise<WebImageCandidate[]> {
  const browser = await launch(true);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });
    await page
      .goto(`https://br.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      })
      .catch(() => {});
    await page.waitForSelector('img[src*="pinimg.com/236x"]', { timeout: 15000 }).catch(() => {});

    const found = new Map<string, WebImageCandidate>();
    let stale = 0;
    for (let i = 0; i < 40 && found.size < limit && stale < 4; i++) {
      const before = found.size;
      const batch = await page.evaluate(() =>
        [...document.querySelectorAll('img[src*="pinimg.com"]')].map((el) => {
          const img = el as HTMLImageElement;
          return { src: img.currentSrc || img.src, alt: img.alt || "" };
        })
      );
      for (const { src, alt } of batch) {
        const m = src.match(/^https:\/\/i\.pinimg\.com\/(\d+x|\d+x\d+)\/(.+)$/);
        if (!m) continue;
        const width = parseInt(m[1], 10);
        if (width < 200) continue; // avatars / board covers
        const rest = m[2];
        if (!found.has(rest)) {
          found.set(rest, {
            thumb: src,
            full: `https://i.pinimg.com/originals/${rest}`,
            fallback: `https://i.pinimg.com/736x/${rest}`,
            alt,
          });
        }
      }
      stale = found.size === before ? stale + 1 : 0;
      await page.evaluate(() => window.scrollBy(0, 1800));
      await new Promise((r) => setTimeout(r, 1000));
    }
    return [...found.values()].slice(0, limit);
  } finally {
    await browser.close();
  }
}

export async function downloadCandidate(c: Pick<WebImageCandidate, "full" | "fallback">): Promise<Buffer> {
  for (const url of [c.full, c.fallback]) {
    try {
      const u = new URL(url);
      if (u.hostname !== "i.pinimg.com") throw new Error("host não permitido");
      const res = await fetch(u, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length <= MAX_BYTES) return buf;
    } catch {
      /* try next */
    }
  }
  throw new Error("download falhou");
}
