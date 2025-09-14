/*
* Nama fitur : Image Upscaler
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const availableScaleRatio = [2, 4]

const imgupscale = {
  req: async (imagePath, scaleRatio) => {
    const form = new FormData()
    form.append('myfile', fs.createReadStream(imagePath))
    form.append('scaleRadio', scaleRatio.toString())

    const response = await axios.request({
      method: 'POST',
      url: 'https://get1.imglarger.com/api/UpscalerNew/UploadNew',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'origin': 'https://imgupscaler.com',
        'referer': 'https://imgupscaler.com/',
        ...form.getHeaders()
      },
      data: form
    })

    return response.data
  },

  cek: async (code, scaleRatio) => {
    const response = await axios.request({
      method: 'POST',
      url: 'https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'origin': 'https://imgupscaler.com',
        'referer': 'https://imgupscaler.com/'
      },
      data: JSON.stringify({ code, scaleRadio: scaleRatio })
    })

    return response.data
  },

  upscale: async (imagePath, scaleRatio, maxRetries = 30, retryDelay = 2000) => {
    const uploadResult = await imgupscale.req(imagePath, scaleRatio)
    if (uploadResult.code !== 200) {
      throw new Error(`Upload failed : ${uploadResult.msg}`)
    }

    const { code } = uploadResult.data
    for (let i = 0; i < maxRetries; i++) {
      const statusResult = await imgupscale.cek(code, scaleRatio)

      if (statusResult.code === 200 && statusResult.data.status === 'success') {
        return {
          success: true,
          downloadUrls: statusResult.data.downloadUrls
        }
      }

      if (statusResult.data.status === 'error') {
        throw new Error('Processing failed on server')
      }

      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }

    throw new Error('Processing timeout - maximum retries exceeded')
  }
}

const handler = async (m, { conn, args }) => {
  if (!m.quoted || !/image/.test(m.quoted.mimetype || '')) {
    return m.reply('reply gambar dengan command .hd 2x atau .hd 4x')
  }

  const scale = args[0]?.replace(/x/i, '') || '2'
  if (!availableScaleRatio.includes(Number(scale))) {
    return m.reply('pilih resolusi : 2x atau 4x')
  }

  try {
    m.reply('wett')
    const buffer = await m.quoted.download()
    const tmpPath = path.join(process.cwd(), `zenn?_${Date.now()}.jpg`)
    fs.writeFileSync(tmpPath, buffer)

    const result = await imgupscale.upscale(tmpPath, Number(scale))
    fs.unlinkSync(tmpPath)

    if (!result.success || !result.downloadUrls?.length) {
      throw new Error('gagal upscale')
    }

    await conn.sendFile(m.chat, result.downloadUrls[0], 'jenzxz.png', '', m)
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['hd 2x atau 4x']
handler.tags = ['ai']
handler.command = ['hd']

export default handler