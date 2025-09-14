import axios from 'axios'
import qs from 'qs'

async function bilibiliDown(urls) {
 function getBilibiliId(url) {
 const match = url.match(/\/video\/(\d+)/)
 return match ? match[1] : null
 }

 const videoId = getBilibiliId(urls)
 
 const url = 'https://bilibili-video-downloader.com/wp-admin/admin-ajax.php'

 const headers = {
 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
 'Accept': '*/*',
 'Referer': 'https://bilibili-video-downloader.com/id/',
 'Content-Type': 'application/x-www-form-urlencoded',
 'Cookie': 'night=0;pll_language=id;_ga=GA1.1.1960969487.1753569405;_ga_2M82ZRZFVW=GS2.1.s1753569404$o1$g0$t1753569407$j57$l0$h0'
 }

 const data = qs.stringify({
 nonce: 'e5a666b33e',
 action: 'get_bilibili_tv_video',
 aid: videoId
 })

 try {
 const response = await axios.post(url, data, { headers })
 return response.data
 } catch (error) {
 return { error: error.message }
 }
}

let handler = async (m, { conn, args }) => {
 try {
 if (!args[0]) return m.reply('Masukkan URL Bilibili!')
 
 m.reply('Wait...')
 
 const result = await bilibiliDown(args[0])
 
 const videoUrl = result.data.video_url
 const videoId = args[0].match(/\/video\/(\d+)/)?.[1] || 'video'
 
 await conn.sendMessage(m.chat, {
 document: { url: videoUrl },
 mimetype: 'video/mp4',
 fileName: `bilibili_${videoId}.mp4`
 }, { quoted: m })
 
 } catch (e) {
 m.reply(e.message)
 }
}

handler.help = ['bilibili']
handler.command = ['bilibili']
handler.tags = ['downloader']

export default handler