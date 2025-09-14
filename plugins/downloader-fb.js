const fbvdl = async (urlFesnuk) => {
    if (typeof urlFesnuk !== "string") throw Error(`mana url nya`)
    const r = await fetch("https://fdown.net/download.php", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ URLz: urlFesnuk })
    })
    if (!r.ok) {
        const txt = await r.text()
        throw Error(`${r.status} ${r.statusText} ${(txt || `(respond body kosong)`).substring(0, 100)}`)
    }
    const html = await r.text()
    const hd = html.match(/id="hdlink" href="(.+?)" download/)?.[1]?.replaceAll("&amp;", "&")
    const sd = html.match(/id="sdlink" href="(.+?)" download/)?.[1]?.replaceAll("&amp;", "&")
    if (!hd && !sd) throw Error(`tidak ada video yang bisa di download`)
    return { hd, sd }
}

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`Contoh : .fbdl https://www.facebook.com/share/v/...`)
    m.reply('wett')
    try {
        const { hd, sd } = await fbvdl(text)
        const videoUrl = hd || sd
        await conn.sendFile(m.chat, videoUrl, '_zenwik.mp4', '', m)
    } catch (e) {
        m.reply(`Eror kak : ${e.message}`)
    }
}

handler.help = ['fbdl <url>']
handler.tags = ['downloader']
handler.command = ['fbdl']

export default handler