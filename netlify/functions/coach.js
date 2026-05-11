/**
 * POST /api/coach
 * Proxies requests to the Anthropic API.
 * The user's API key is passed in the x-api-key header — never stored.
 */
export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = req.headers.get("x-coach-key");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "no_key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const errCode =
        res.status === 401 ? "invalid_key" :
        res.status === 429 ? "rate_limit" :
        "api_error";
      return new Response(JSON.stringify({ error: errCode, detail: data.error?.message }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Coach proxy error:", err);
    return new Response(JSON.stringify({ error: "network" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/coach" };
