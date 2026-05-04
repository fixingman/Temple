export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Service not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { area, description, recentExercises } = body;
  if (!area || !description) {
    return new Response(JSON.stringify({ error: "Missing required fields." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const exerciseContext = recentExercises?.length
    ? `The user's most recent workout included: ${recentExercises.join(", ")}.`
    : "No recent workout data available.";

  const prompt = `You are a knowledgeable fitness recovery assistant. A user is reporting post-workout discomfort.

${exerciseContext}

Body area: ${area}
User's description: ${description}

Provide a structured, practical response with these sections:
1. **What's likely happening** — 2-3 sentences explaining the probable cause, connecting it to their workout if relevant.
2. **Severity check** — Is this normal DOMS/fatigue, or does it sound like something that needs attention? Be direct.
3. **What to do now** — 3-4 concrete immediate actions (rest, ice, stretch, etc.)
4. **This week** — How to adjust training. What to avoid, what's still fine.
5. **See a professional if** — Clear red flags that mean they should stop and get checked.

Keep it concise, practical, and honest. Don't over-reassure. Don't diagnose. Use plain language.
End with a one-line reminder that this is general guidance and not a substitute for professional medical advice.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", err);
      return new Response(JSON.stringify({ error: "Could not get a response. Try again." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong. Try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/recovery" };
