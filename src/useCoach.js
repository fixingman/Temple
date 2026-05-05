import { useCallback } from 'react';

export const MODELS = {
  fast:    "claude-haiku-4-5-20251001",   // simple tasks: ordering, swaps, short tips
  smart:   "claude-sonnet-4-6",            // nuanced tasks: body check, gap analysis
};

const DEFAULT_MAX_TOKENS = 800;

/**
 * useCoach — Temple's AI layer.
 *
 * Usage:
 *   const { ask, hasKey } = useCoach(data.settings?.anthropicKey);
 *   const result = await ask(prompt, { maxTokens: 600 });
 *
 * Returns: { text, error } — always resolves, never throws.
 */
export function useCoach(apiKey = "") {
  const hasKey = !!apiKey?.trim();

  const ask = useCallback(async (prompt, opts = {}) => {
    if (!hasKey) return { text: "", error: "no_key" };

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-client-side-api-key-unsafe": "true",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: opts.model || MODELS.fast,
          max_tokens: opts.maxTokens || DEFAULT_MAX_TOKENS,
          system: opts.system || "You are Temple Coach, a concise, knowledgeable personal training assistant. You give practical, specific advice. No fluff. No disclaimers unless safety is at risk.",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) return { text: "", error: "invalid_key" };
        if (res.status === 429) return { text: "", error: "rate_limit" };
        return { text: "", error: data.error?.message || "api_error" };
      }

      return { text: data.content?.[0]?.text || "", error: null };
    } catch {
      return { text: "", error: "network" };
    }
  }, [apiKey, hasKey]);

  return { ask, hasKey };
}

// ─── Error messages for UI ───
export const coachError = (error) => ({
  no_key:      "Add your Anthropic API key in Settings to use AI features.",
  invalid_key: "Invalid API key. Check your key in Settings.",
  rate_limit:  "Too many requests. Wait a moment and try again.",
  network:     "Could not connect. Check your internet and try again.",
  api_error:   "Something went wrong. Try again.",
}[error] || "Something went wrong. Try again.");

// ─── Prompts — one function per feature ───
// model: "fast" (Haiku) for structured/simple tasks, "smart" (Sonnet) for nuanced judgment
// Caller passes the model string from MODELS to coach.ask({ model: MODELS.fast })

export const prompts = {

  /**
   * Suggest optimal exercise order for a workout set.
   * @param {Array} exercises — [{name, muscle, equipment, category}]
   */
  exerciseOrder: (exercises) => {
    const list = exercises.map((e, i) => `${i + 1}. ${e.name} (${e.muscle}, ${e.equipment}, ${e.category})`).join("\n");
    return `Reorder these exercises for optimal performance in one workout session:\n\n${list}\n\nRules to apply:
- Compound movements before isolation
- Larger muscle groups before smaller
- Higher CNS demand first (squats, deadlifts, bench press)
- Mobility/warmup movements at the start if present
- Antagonist pairs can be alternated (push/pull)

Return ONLY a JSON array of the exercise names in the optimal order, no explanation. Example: ["Squat", "Romanian Deadlift", "Leg Press", "Leg Curl"]`;
  },

  /**
   * Post-session recovery tip based on what was trained.
   * @param {Array} exercises — exercise names
   * @param {Object} volume — { totalSets, totalReps, totalKg }
   */
  recoveryTip: (exercises, volume) => {
    return `A user just finished a workout: ${exercises.join(", ")}. Total: ${volume.totalSets} sets, ${volume.totalReps} reps, ${volume.totalKg}kg volume.

Give a 2-3 sentence recovery tip specific to what they trained. Focus on the highest-demand muscle groups. Be concrete (specific stretches, timing, nutrition if relevant). No generic advice.`;
  },

  /**
   * Suggest an exercise swap for an injured area.
   * @param {string} exercise — current exercise name
   * @param {string} area — injured body area
   * @param {Array} available — available exercises in the library
   */
  exerciseSwap: (exercise, area, available) => {
    const avail = available.slice(0, 30).map(e => e.name).join(", ");
    return `A user wants to swap "${exercise}" because their ${area} hurts.

Available exercises in their library: ${avail}

Suggest 2-3 alternative exercises from their library (or general alternatives if none fit) that:
- Work similar muscle groups
- Avoid loading the ${area}
- Can be done safely

Return ONLY a JSON array: [{"name": "...", "reason": "one sentence why"}]. Max 3 items.`;
  },

  /**
   * Analyse training history and suggest undertrained areas.
   * @param {Array} sessions — recent sessions with exercise names
   * @param {Array} existingSets — existing workout set names
   */
  gapAnalysis: (muscleVolume, existingSets) => {
    const vol = Object.entries(muscleVolume)
      .sort((a, b) => b[1] - a[1])
      .map(([m, v]) => `${m}: ${v} sets`)
      .join(", ");
    const sets = existingSets.join(", ");
    return `A user's training volume over the past 4 weeks by muscle group: ${vol || "No data yet"}.
Their existing workout sets: ${sets || "None"}.

Identify the 2 most undertrained or neglected muscle groups and suggest a new workout set for each.
Return ONLY a JSON array: [{"setName": "...", "exercises": ["...", "...", "..."], "reason": "one sentence"}]. Max 2 sets.`;
  },

  /**
   * Body check — post-workout pain guidance.
   * @param {string} area — body area
   * @param {string} description — user's description
   * @param {Array} recentExercises — exercise names
   */
  bodyCheck: (area, description, recentExercises) => {
    const context = recentExercises.length
      ? `Recent workout: ${recentExercises.join(", ")}.`
      : "No recent workout data.";
    return `${context}

User reports: ${area} — "${description}"

Respond with these sections:
**What's likely happening** — probable cause, connect to workout if relevant (2-3 sentences).
**Severity check** — normal DOMS or needs attention? Be direct.
**What to do now** — 3-4 concrete actions.
**This week** — training adjustments, what to avoid.
**See a professional if** — specific red flags.

End with one line: this is general guidance, not medical advice.`;
  },
};
