import CryptoJS from 'crypto-js'

const mp3dl = {
  generateToken: () => {
    let payload = JSON.stringify({ timestamp: Date.now() })
    let key = 'dyhQjAtqAyTIf3PdsKcJ6nMX1suz8ksZ'
    return CryptoJS.AES.encrypt(payload, key).toString()
  },
  download: async youtubeUrl => {
    let json = await fetch('https://ds1.ezsrv.net/api/convert', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        url: youtubeUrl,
        quality: 128,
        trim: false,
        startT: 0,
        endT: 0,
        token: mp3dl.generateToken()
      })
    }).then(res => res.json())
    return json
  }
}

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) 
  return m.reply('Mana Link Youtube Nya\n\n*Example :* .yta https://youtu.be/LY5aLM-UEJk?si=A6nu874aQxEdfiaE')
    let { url, title, status } = await mp3dl.download(args[0])
    await conn.sendMessage(m.chat, {
      document: { url },
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m })
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['yta']
handler.command = ['yta']
handler.tags = ['downloader']

export default handler