import { NextRequest, NextResponse } from "next/server";

// Minimal valid 1x1 PNG (transparent) - avoids 404 for PWA manifest icon requests
// Replace with real icons in public/icons/ when you have them
const MINIMAL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  const pathStr = path?.join("/") ?? "";
  // Serve a valid tiny PNG for any icon path so manifest doesn't 404
  return new NextResponse(MINIMAL_PNG, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
}
