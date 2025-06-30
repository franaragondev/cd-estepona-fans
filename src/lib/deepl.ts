export async function translateText(text: string, targetLang: "EN" | "FR") {
  const apiKey = process.env.DEEPL_API_KEY!;
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
    body: new URLSearchParams({
      text,
      target_lang: targetLang,
    }),
  });

  const data = await res.json();
  return data.translations?.[0]?.text || text;
}
