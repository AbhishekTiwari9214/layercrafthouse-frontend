import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_PROXY_URL || "http://127.0.0.1:8000";

function decodeOAuthState(state: string | null) {
  if (!state) {
    return { redirect: "/checkout", callbackUrl: null as string | null };
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(state, "base64url").toString("utf8"),
    ) as { redirect?: string; callbackUrl?: string };

    const redirect =
      typeof parsed.redirect === "string" &&
      parsed.redirect.startsWith("/") &&
      !parsed.redirect.startsWith("//")
        ? parsed.redirect
        : "/checkout";
    const callbackUrl =
      typeof parsed.callbackUrl === "string" ? parsed.callbackUrl : null;

    return { redirect, callbackUrl };
  } catch {
    // Fall through to default redirect.
  }

  return { redirect: "/checkout", callbackUrl: null as string | null };
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

  const oauthState = decodeOAuthState(state);
  const redirectCandidates = [
    oauthState.callbackUrl,
    "https://www.layercrafthouse.com/api/auth/google/callback",
    "https://layercrafthouse.com/api/auth/google/callback",
    `${request.nextUrl.origin}/api/auth/google/callback`,
  ].filter((value, index, list): value is string => {
    return Boolean(value) && list.indexOf(value) === index;
  });

  let backendResponse: Response | null = null;
  let lastMessage = "Google sign-in failed. Please try again.";

  try {
    for (const redirectUri of redirectCandidates) {
      backendResponse = await fetch(`${API_URL}/api/auth/google/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
      });

      if (backendResponse.ok) {
        break;
      }

      try {
        const payload = await backendResponse.json();
        if (payload.message) lastMessage = payload.message;
      } catch {
        // Keep previous message.
      }

      if (lastMessage !== "Invalid Google callback URL") {
        break;
      }
    }
  } catch {
    return loginErrorRedirect(
      request,
      "Could not reach the server. Please try again.",
    );
  }

  if (!backendResponse?.ok) {
    return loginErrorRedirect(request, lastMessage);
  }

  const destination = oauthState.redirect;
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
