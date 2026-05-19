const CLIENT_ID = "186862100308-4lfr928avpodulpf4d70m9jteh1qgm2r.apps.googleusercontent.com";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    return new Response(JSON.stringify({ error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { action, code, refresh_token } = body;

  let params;
  if (action === "exchange" && code) {
    params = {
      grant_type: "authorization_code",
      code,
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: "postmessage",
    };
  } else if (action === "refresh" && refresh_token) {
    params = {
      grant_type: "refresh_token",
      refresh_token,
      client_id: CLIENT_ID,
      client_secret: clientSecret,
    };
  } else {
    return new Response(JSON.stringify({ error: "invalid_action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return new Response(JSON.stringify({ error: data.error || "token_failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({
      access_token: data.access_token,
      expires_in: data.expires_in,
      ...(data.refresh_token ? { refresh_token: data.refresh_token } : {}),
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "network_error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/google-token" };
