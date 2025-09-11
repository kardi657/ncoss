import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukkan URL YouTube!', m);

    let apiUrl = `https://api.betabotz.eu.org/api/download/ytmp4?url=${encodeURIComponent(text)}&apikey=${btz}`;

    try {
await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status) {
            let { title, mp4, thumb, duration, id, description } = data.result;

            let caption = `🎬 *YTMP4*\n\n📌 *Judul:* ${title}\n⏳ *Durasi:* ${duration} detik\n`;      
            await conn.sendMessage(m.chat, { 
                video: { url: mp4 }, 
                caption 
            }, { quoted: m });

            
            
        } else {
            await conn.reply(m.chat, 'Gagal mengambil data.', m);
        }
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'Terjadi kesalahan!', m);
    } finally {
await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
}
};

handler.help = ['ytmp4'];
handler.command = ['ytmp4'];
handler.tags = ['downloader'];
export default handler;