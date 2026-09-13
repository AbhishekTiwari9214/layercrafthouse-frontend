import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_PROXY_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get("redirect") || "/checkout";
  const callbackUrl = `${request.nextUrl.origin}/api/auth/google/callback`;
  const startUrl = new URL(`${API_URL}/api/auth/google`);
  startUrl.searchParams.set("redirect", redirect);
  startUrl.searchParams.set("callbackUrl", callbackUrl);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(startUrl.toString(), {
      redirect: "manual",
    });
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      "Could not reach the server. Please try again.",
    );
    return NextResponse.redirect(loginUrl);
  }

  const location = backendResponse.headers.get("location");
  if (location && backendResponse.status >= 300 && backendResponse.status < 400) {
    return NextResponse.redirect(location);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "Google sign-in failed to start. Please try again.");
  return NextResponse.redirect(loginUrl);
}
