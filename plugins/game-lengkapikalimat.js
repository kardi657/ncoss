import fs from 'fs'
import fetch from 'node-fetch'
let timeout = 120000
let poin = 4999
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat: {}
    let id = m.chat
    if (id in conn.lengkapikalimat) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.lengkapikalimat[id][0])
    let src = await (await fetch(`https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkalimat.json`)).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hlen untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.lengkapikalimat[id] = [
        await m.reply(caption),
        json, poin, 4,
        setTimeout(() => {
            if (conn.lengkapikalimat[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id][0])
            delete conn.lengkapikalimat[id]
        }, timeout)
    ]
}
handler.help = ['lengkapikalimat']
handler.tags = ['game']
handler.command = /^lengkapikalimat$/i
export default handler