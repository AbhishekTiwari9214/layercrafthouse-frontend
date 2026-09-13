import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_PROXY_URL || "http://127.0.0.1:8000";

function decodeOAuthState(state: string | null) {
  if (!state) return "/checkout";

  try {
    const parsed = JSON.parse(
      Buffer.from(state, "base64url").toString("utf8"),
    ) as { redirect?: string };

    if (
      typeof parsed.redirect === "string" &&
      parsed.redirect.startsWith("/") &&
      !parsed.redirect.startsWith("//")
    ) {
      return parsed.redirect;
    }
  } catch {
    // Fall through to default redirect.
  }

  return "/checkout";
}

function loginErrorRedirect(request: NextRequest, message: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    return loginErrorRedirect(request, "Google sign-in was cancelled.");
  }

  if (!code) {
    return loginErrorRedirect(request, "Google sign-in failed. Please try again.");
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${API_URL}/api/auth/google/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    });
  } catch {
    return loginErrorRedirect(
      request,
      "Could not reach the server. Please try again.",
    );
  }

  if (!backendResponse.ok) {
    let message = "Google sign-in failed. Please try again.";
    try {
      const payload = await backendResponse.json();
      if (payload.message) message = payload.message;
    } catch {
      // Keep default message.
    }
    return loginErrorRedirect(request, message);
  }

  const destination = decodeOAuthState(state);
  const response = NextResponse.redirect(new URL(destination, request.url));

  const setCookies =
    typeof backendResponse.headers.getSetCookie === "function"
      ? backendResponse.headers.getSetCookie()
      : [];

  const legacySetCookie = backendResponse.headers.get("set-cookie");

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
  } else if (legacySetCookie) {
    response.headers.append("set-cookie", legacySetCookie);
  }

  return response;
}
