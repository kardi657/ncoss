const snapins = async (urlIgPost) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded"
    }

    const response = await fetch("https://snapins.ai/action.php", {
        headers,
        body: "url=" + encodeURIComponent(urlIgPost),
        method: "POST"
    })

    if (!response.ok) throw Error(`gagal mendownload informasi. ${response.status} ${response.statusText}`)

    const json = await response.json()

    const name = json.data?.[0]?.author?.name || "(no name)"
    const username = json.data?.[0]?.author?.username || "(no username)"

    let images = []
    let videos = []

    json.data?.forEach(v => {
        if (v.type === "image") {
            images.push(v.imageUrl)
        } else if (v.type === "video") {
            videos.push(v.videoUrl)
        }
    })

    return { name, username, images, videos }
}

let handler = async (m, { conn, args, command }) => {
    if (!args[0]) throw `mana url Instagram nya?\ncontoh : .${command} https://www.instagram.com/p/xxxxx/`
    m.reply('wett')

    let { images, videos } = await snapins(args[0])

    if (images.length > 0) {
        await m.reply(`terdeteksi ${images.length} foto, wett akan ku kirim`)
        for (const img of images) {
            await conn.sendMessage(m.chat, { image: { url: img } }, { quoted: m })
        }
    }

    if (videos.length > 0) {
        for (const vid of videos) {
            await conn.sendMessage(m.chat, { video: { url: vid } }, { quoted: m })
        }
    }
}

handler.command = ['ig', 'igdl', 'instagram']
handler.help = ['igdl']
handler.tags = ['downloader']

export default handler