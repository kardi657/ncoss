import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return m.reply(`Balas gambar dengan perintah *${usedPrefix + command}*`);

    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    try {
        let img = await q.download();
        let url = await uploadImage(img);

        let { data } = await axios.get(`https://api.betabotz.eu.org/api/tools/remini?url=${url}&apikey=${btz}`);
        await conn.sendFile(m.chat, data.url, '', `✅ Sukses *${command}*`, m);
    } catch (e) {
        console.error(e);
        m.reply('⚠️ Gagal memproses gambar.');
    }
};

handler.help = ['remini'];
handler.tags = ['ai'];
handler.command = /^(remini|hd)$/i;
handler.limit = true;
export default handler;

// Fungsi Upload
async function uploadImage(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('file', buffer, {
        filename: `image.${ext}`,
        contentType: mime,
    });

    const { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders(),
    });

    let result = data.data?.url.split("org")[1]
return `https://tmpfiles.org/dl${result}`
}