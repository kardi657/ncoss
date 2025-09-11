let {
	proto
} = (await import('baileys')).default

let handler = async (m, { conn, args }) => {
    if (global.xmaze.some(number => m.sender.includes(number))) {
	let list = Object.entries(global.db.data.users)
	let lim = !args || !args[0] ? 100: isNumber(args[0]) ? parseInt(args[0]) : 100
	lim = Math.max(1, lim)
	list.map(([user, data], i) => (Number(data.limit = lim)))
		conn.reply(m.chat, `*berhasil direset ${lim} / user*`, m)
		} else {
    m.reply('This command is for *R-OWNER* Only')
    }
}
handler.help = ['limit'].map(v => 'reset' + v)
handler.tags = ['owner']
handler.command = /^(resetlimit)$/i
handler.owner = true

export default handler