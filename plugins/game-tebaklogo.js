import fs from 'fs'
import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo: {}
    let id = m.chat
    if (id in conn.tebaklogo) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklogo[id][0])
    let src = await (await fetch(`https://encos.my.id/Game/tebaklogo.json`)).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.deskripsi}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hlogo untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebaklogo[id] = [
        await conn.sendFile(m.chat, json.img, 'tebaklogo.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebaklogo[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaklogo[id][0])
            delete conn.tebaklogo[id]
        }, timeout)
    ]
}
handler.help = ['tebaklogo']
handler.tags = ['game']
handler.command = /^tebaklogo$/i
export default handler