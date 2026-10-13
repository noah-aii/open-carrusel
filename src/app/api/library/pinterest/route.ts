import { NextResponse } from "next/server";
import {
  cachedLoginState,
  closePinterestLogin,
  isLoginWindowOpen,
  openPinterestLogin,
  pinterestLoggedIn,
} from "@/lib/web-image-search";

export const maxDuration = 60;

// Login state of the saved Pinterest profile.
export async function GET() {
  const windowOpen = isLoginWindowOpen();
  if (windowOpen) return NextResponse.json({ loggedIn: false, windowOpen });
  // If Chrome is busy (search/login in progress) answer from cache instead of queueing behind it.
  const { busy, loggedIn: cached } = cachedLoginState();
  if (busy) return NextResponse.json({ loggedIn: cached ?? false, windowOpen: false });
  return NextResponse.json({ loggedIn: await pinterestLoggedIn().catch(() => false), windowOpen: false });
}

// { action: "open" } shows the login window on this Mac; { action: "close" } saves the session.
export async function POST(request: Request) {
  const { action } = await request.json().catch(() => ({}));
  if (action === "open") {
    await openPinterestLogin();
    return NextResponse.json({ windowOpen: true });
  }
  if (action === "close") {
    await closePinterestLogin();
    return NextResponse.json({ windowOpen: false, loggedIn: await pinterestLoggedIn().catch(() => false) });
  }
  return NextResponse.json({ error: "action must be open or close" }, { status: 400 });
}
