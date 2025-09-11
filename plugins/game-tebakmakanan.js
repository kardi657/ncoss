import fs from 'fs'
import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakmakanan = conn.tebakmakanan ? conn.tebakmakanan: {}
    let id = m.chat
    if (id in conn.tebakmakanan) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakmakanan[id][0])
    let src = await (await fetch(`https://encos.my.id/Game/tebakmakanan.json`)).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.deskripsi}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}teman untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.tebakmakanan[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakmakanan.jpg', caption, m),
        json, poin, 4,
        setTimeout(() => {
            if (conn.tebakmakanan[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakmakanan[id][0])
            delete conn.tebakmakanan[id]
        }, timeout)
    ]
}
handler.help = ['tebakmakanan']
handler.tags = ['game']
handler.command = /^tebakmakanan$/i
export default handler