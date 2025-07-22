// apps/web/src/lib/gemini.ts
export async function getWaterPHFromGemini(species: string, location?: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
  const prompt = `What is the ideal water pH for ${species}${location ? ` grown in ${location}` : ''}? Respond with only a number (e.g., 6.0) and nothing else.`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await res.json();
  // Extract the answer from Gemini's response
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer found';
}
