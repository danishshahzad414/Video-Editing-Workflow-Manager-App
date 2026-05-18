const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const MODEL = 'claude-sonnet-4-20250514'

export async function generateCaption(
  platform: string,
  title: string,
  category: string,
  description: string,
  charLimit: number
): Promise<string> {
  const systemPrompt = `You are a social media content writer for an education consultancy called The Migration based in Melbourne, Australia. Write engaging, professional captions that connect with international students and migrants. Always end with a clear call to action. Respond with ONLY the caption text and hashtags — no explanations, no preamble, no quotation marks.`

  const userPrompt = `Write a ${platform} caption for a video titled '${title}' in the category '${category}'. Description: '${description}'. Target audience: international students and migrants considering studying or migrating to Australia. Include 5-8 relevant hashtags at the end. Keep it under ${charLimit} characters total.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0]?.text || ''
}
