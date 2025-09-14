import axios from 'axios'

async function translateToIndonesian(text) {
  const url = "https://translate.googleapis.com/translate_a/single"
  const params = {
    client: "gtx",
    sl: "auto", 
    tl: "id",
    dt: "t",
    q: text
  }
  
  let res = await axios.get(url, { params })
  return res.data[0][0][0]
}

const kimi = {
  _generateId() {
    return String(Date.now()) + Math.floor(Math.random() * 1000)
  },

  _createHeaders(deviceId, sessionId) {
    return {
      'content-type': 'application/json',
      'x-language': 'zh-CN',
      'x-msh-device-id': deviceId,
      'x-msh-platform': 'web',
      'x-msh-session-id': sessionId,
      'x-traffic-id': deviceId
    }
  },

  async getToken() {
    const deviceId = this._generateId()
    const sessionId = this._generateId()
    const headers = this._createHeaders(deviceId, sessionId)

    let response = await axios.post('https://www.kimi.com/api/device/register', {}, {
      headers,
      timeout: 10000
    })

    return {
      auth: `Bearer ${response.data.access_token}`,
      cookie: response.headers['set-cookie'].join('; '),
      headers
    }
  },
  
  async chat(question, model = 'k2') {
    let { auth, cookie, headers } = await this.getToken()

    let chatResponse = await axios.post('https://www.kimi.com/api/chat', {
      name: '未命名会话',
      born_from: 'home',
      kimiplus_id: 'kimi',
      is_example: false,
      source: 'web',
      tags: []
    }, {
      headers: {
        authorization: auth,
        cookie: cookie,
        ...headers
      },
      timeout: 10000
    })

    let chatId = chatResponse.data.id

    let completionResponse = await axios.post(
      `https://www.kimi.com/api/chat/${chatId}/completion/stream`, 
      {
        kimiplus_id: 'kimi',
        extend: { sidebar: true },
        model: model,
        use_search: true,
        messages: [{ role: 'user', content: question.trim() }],
        refs: [],
        history: [],
        scene_labels: [],
        use_semantic_memory: false,
        use_deep_research: false
      }, 
      {
        headers: {
          authorization: auth,
          cookie: cookie,
          ...headers
        },
        timeout: 30000
      }
    )

    let result = { text: '', search_by: [], sources: [], citations: [] }
    let lines = completionResponse.data.split('\n\n')
    
    for (let line of lines) {
      if (line.startsWith('data:')) {
        try {
          let data = JSON.parse(line.substring(6))
          
          if (data.event === 'cmpl' && data.text) {
            result.text += data.text
          }
          
          if (data.event === 'search_plus' && data.msg?.type === 'target' && data.msg.targets) {
            result.search_by = data.msg.targets
          }
          
          if (data.event === 'search_plus' && data.type === 'get_res' && data.msg) {
            result.sources.push(data.msg)
          }
          
          if (data.event === 'search_citation' && data.values) {
            result.citations = Object.values(data.values)
          }
        } catch (parseError) {}
      }
    }

    return result
  }
}

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0]) return m.reply('Masukkan pertanyaan!\nContoh: .kimi-k1 apa itu AI?')
    
    let question = args.join(' ')
    let model
    
    switch (command) {
      case 'kimi-k1':
        model = 'k1.5'
        break
      case 'kimi-k2':
        model = 'k2'
        break
      default:
        model = 'k2'
    }
    
    m.reply('Think....')
    
    let response = await kimi.chat(question, model)
    
    let cleanText = response.text.replace(/\[\^\d+\^\]/g, '').trim()
    let translatedText = await translateToIndonesian(cleanText)
    
    await m.reply(translatedText)
    
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['kimi-k1', 'kimi-k2']
handler.command = ['kimi-k1', 'kimi-k2']
handler.tags = ['ai']

export default handler