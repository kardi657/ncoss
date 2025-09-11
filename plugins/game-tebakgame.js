import fs from 'fs'
import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
    let id = m.chat
    if (id in conn.tebakgame) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgame[id][0])
    let src = await (await fetch(`https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json`)).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
Logo apakah ini?

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hgame untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakgame[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakgame.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakgame[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgame[id][0])
            delete conn.tebakgame[id]
        }, timeout)
    ]
}
handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = /^tebakgame$/i
export default handler