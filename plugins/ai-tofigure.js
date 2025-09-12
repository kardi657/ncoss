/*
*TO FIGURE*
- author & scrape: gienetic [ https://pastebin.com/TUe6MmLM ]

- khaerul
*/
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import { fileURLToPath } from "url";

const BASE_URL = "https://ai-apps.codergautam.dev";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function handler(m, { conn, text, usedPrefix, command }) {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${usedPrefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung!`);

  let promptText =
    text ||
    "Use the nano-banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the Blender modeling process of the figure. Next to the computer screen, place a marvel-style toy packaging box printed with the original artwork.";

  // FIXED: langsung pake reply biasa, gak pake global.mess
  m.reply("⏳ Tunggu sebentar, lagi diproses...");

  try {
    let imgData = await q.download();
    let resultBuffer = await img2img(imgData, promptText);

    const outputDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputPath = path.join(outputDir, `img2img_${Date.now()}.jpg`);
    fs.writeFileSync(outputPath, resultBuffer);

    await conn.sendMessage(
      m.chat,
      {
        image: { url: outputPath },
        caption: `Jadi cuy!`,
      },
      { quoted: m }
    );

    setTimeout(() => {
      try {
        fs.unlinkSync(outputPath);
      } catch {}
    }, 30000);
  } catch (e) {
    console.error(e);
    m.reply("error: " + e.message);
  }
}

handler.command = ["nanobanana", "tofigure"];
handler.help = ["tofigure"];
handler.tags = ["ai"];
export default handler;

function acakName(len = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function autoregist() {
  const uid = crypto.randomBytes(12).toString("hex");
  const email = `gienetic${Date.now()}@nyahoo.com`;

  const payload = {
    uid,
    email,
    displayName: acakName(),
    photoURL: "https://i.pravatar.cc/150",
    appId: "photogpt",
  };

  const res = await axios.post(`${BASE_URL}/photogpt/create-user`, payload, {
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": "okhttp/4.9.2",
    },
  });

  if (res.data.success) return uid;
  throw new Error("Register gagal cuy: " + JSON.stringify(res.data));
}

async function img2img(imageBuffer, prompt) {
  const uid = await autoregist();

  const form = new FormData();
  form.append("image", imageBuffer, { filename: "input.jpg", contentType: "image/jpeg" });
  form.append("prompt", prompt);
  form.append("userId", uid);

  const uploadRes = await axios.post(`${BASE_URL}/photogpt/generate-image`, form, {
    headers: {
      ...form.getHeaders(),
      accept: "application/json",
      "user-agent": "okhttp/4.9.2",
      "accept-encoding": "gzip",
    },
  });

  if (!uploadRes.data.success) throw new Error(JSON.stringify(uploadRes.data));

  const { pollingUrl } = uploadRes.data;
  let status = "pending";
  let resultUrl = null;

  while (status !== "Ready") {
    const pollRes = await axios.get(pollingUrl, {
      headers: { accept: "application/json", "user-agent": "okhttp/4.9.2" },
    });
    status = pollRes.data.status;
    if (status === "Ready") {
      resultUrl = pollRes.data.result.url;
      break;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (!resultUrl) throw new Error("Gagal mendapatkan hasil gambar.");

  const resultImg = await axios.get(resultUrl, { responseType: "arraybuffer" });
  return Buffer.from(resultImg.data);
}
