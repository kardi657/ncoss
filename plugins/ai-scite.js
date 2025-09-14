import { randomUUID } from "crypto"

async function sciteAI(prompt) {
  const anonId = randomUUID()
  
  const postRes = await fetch("https://api.scite.ai/assistant/poll", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; vivo 1901 Build/RP1A.200720.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Content-Type": "application/json",
      "sec-ch-ua-platform": '"Android"',
      "Authorization": "Bearer null",
      "sec-ch-ua": '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
      "sec-ch-ua-mobile": "?1",
      "Origin": "https://scite.ai",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": "https://scite.ai/",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    body: JSON.stringify({
      turns: [{ role: "user", content: prompt }],
      user_input: prompt,
      session_id: null,
      country: null,
      alwaysUseReferences: false,
      neverUseReferences: false,
      abstractsOnly: false,
      fullTextsOnly: false,
      numReferences: 25,
      rankBy: "relevance",
      answerLength: "medium",
      model: "gpt-4o-mini-2024-07-18",
      reasoningEffort: "medium",
      yearFrom: "",
      yearTo: "",
      topics: [],
      journals: [],
      citationSections: [],
      publicationTypes: [],
      citationStyle: "apa",
      dashboards: [],
      referenceChecks: [],
      dois: [],
      useStructuredResponse: false,
      anon_id: anonId
    })
  })

  const postData = await postRes.json()
  const taskId = postData.id

  let resultData
  while (true) {
    const getRes = await fetch(`https://api.scite.ai/assistant/tasks/${taskId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; vivo 1901 Build/RP1A.200720.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.143 Mobile Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "sec-ch-ua-platform": '"Android"',
        "Authorization": "Bearer null",
        "sec-ch-ua": '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
        "sec-ch-ua-mobile": "?1",
        "Origin": "https://scite.ai",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://scite.ai/",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    })
    resultData = await getRes.json()

    if (resultData.status === "SUCCESS") break
    await new Promise(res => setTimeout(res, 1500))
  }

  const assistantTurn = resultData.result?.turns?.find(t => t.role === "assistant")
  return assistantTurn?.content || null
}

let handler = async (m, { conn, args }) => {
  try {
    const query = args.join(' ')
    if (!query) return m.reply('Nn?')
    
    m.reply('Wait...')
    
    await m.reply(await sciteAI(query))
    
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['scite']
handler.command = ['sciteai', 'scite']
handler.tags = ['ai']

export default handler