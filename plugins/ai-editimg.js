import axios from 'axios'
import FormData from 'form-data'
import { Jimp } from 'jimp'

async function scrapeApiKey() {
  let { data } = await axios.get('https://overchat.ai/image/ghibli', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })
  let match = data.match(/const apiKey = '([^']+)'/)
  return match?.[1] || null
}

async function editImage(imageBuffer, prompt, apiKey) {
  let form = new FormData()
  form.append('image', imageBuffer, 'image.png')
  form.append('prompt', prompt)
  form.append('model', 'gpt-image-1')
  form.append('n', 1)
  form.append('size', '1024x1024')
  form.append('quality', 'medium')

  let { data } = await axios.post('https://api.openai.com/v1/images/edits', form, {
    headers: {
      ...form.getHeaders(),
      'Authorization': `Bearer ${apiKey}`
    }
  })

  return data.data?.[0]?.b64_json
}

let handler = async (m, { conn, args, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) return m.reply('Mana gambarnya')

    m.reply('Wait...')

    let mediaBuffer = await q.download()
    let image = await Jimp.read(mediaBuffer)
    let pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG)

    let apiKey = await scrapeApiKey()

    let prompt
    switch (command) {
      case 'toghibli':
        prompt = 'Please convert this image into Studio Ghibli art style'
        break
      case 'editimg':
        if (!args.join(' ')) return m.reply('Kasoh Gambar nya + Promt editimg nya')
        prompt = args.join(' ')
        break
    }

    let base64Result = await editImage(pngBuffer, prompt, apiKey)
    let resultBuffer = Buffer.from(base64Result, 'base64')

    await conn.sendMessage(m.chat, {
      image: resultBuffer,
    }, { quoted: m })

  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['toghibli', 'editimg']
handler.command = ['toghibli', 'editimg']
handler.tags = ['tools']

export default handler