import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukkan URL YouTube!', m);

    let apiUrl = `https://api.betabotz.eu.org/api/download/ytmp3?url=${encodeURIComponent(text)}&apikey=${btz}`;

    try {
await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status) {
            let { title, mp3, thumb, duration, id, description } = data.result;

            let caption = `🎵 *YTMP3*\n\n📌 *Judul:* ${title}\n⏳ *Durasi:* ${duration} detik\n`;

           let img  = await conn.sendMessage(m.chat, { image: { url: thumb }, caption }, { quoted: m });

            await conn.sendMessage(m.chat, { 
                audio: { url: mp3 }, 
                mimetype: 'audio/mp4', 
                ptt: false 
            }, { quoted: img });

            
            
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

handler.help = ['ytmp3'];
handler.command = ['ytmp3'];
handler.tags = ['downloader'];
export default handler;