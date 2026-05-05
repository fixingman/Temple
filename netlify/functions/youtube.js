export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "YouTube search not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const ytUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    ytUrl.searchParams.set("key", apiKey);
    ytUrl.searchParams.set("q", query);
    ytUrl.searchParams.set("part", "snippet");
    ytUrl.searchParams.set("type", "video");
    ytUrl.searchParams.set("maxResults", "8");
    ytUrl.searchParams.set("videoEmbeddable", "true");
    ytUrl.searchParams.set("relevanceLanguage", "en");
    ytUrl.searchParams.set("safeSearch", "moderate");

    const res = await fetch(ytUrl.toString());
    if (!res.ok) {
      const err = await res.json();
      console.error("YouTube API error:", err);
      return new Response(JSON.stringify({ error: "YouTube search failed." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const videos = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    }));

    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // cache 1hr — same query = same results
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = { path: "/api/youtube" };
