let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) throw `*Mna Gamabar Nya*`
  let img = await q.download()
  let form = new FormData()
  form.append('format', 'png')
  form.append('model', 'v1')
  form.append('image', new Blob([img]))
  
  let res = await fetch('https://api2.pixelcut.app/image/matte/v1', {
    method: 'POST',
    headers: {
      'x-client-version': 'web',
      ...form.headers
    },
    body: form
  })
  
  conn.sendMessage(m.chat, { 
    image: Buffer.from(await res.arrayBuffer())
  }, { quoted: m })
}

handler.help = ['removebg']
handler.command = ['removebg']
handler.tags = ['tools']

export default handler