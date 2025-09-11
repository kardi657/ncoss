import {
    Sticker
} from 'wa-sticker-formatter';
import fetch from 'node-fetch'

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text || 'hai'
    } else if (text) {
        text = text
    } else if (!text && !m.quoted) return m.reply('reply / masukan teks');

    try {
        
        await m.reply('> Tunggu Sebentar lagi di proses...')
        const response = `https://aqul-brat.hf.space?text=${encodeURIComponent(text)}`
        
        let stiker = await createSticker(false, response, 10)
        if (stiker) await conn.sendFile(m.chat, stiker, '', '', m)
    } catch (e) {
        throw e
    }
}

handler.help = ['brat']
handler.tags = ['sticker']
handler.command = /^(brat)$/i
handler.limit = true
export default handler

async function createSticker(img, url, pack, author, quality) {
    let stickerMetadata = {
        type: 'crop',
        pack: stickpack,
        author: stickauth,
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}