import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

/*============== GLOBAL APIKEY ==============*/
global.btz = 'apikey'

/*============== NOMOR ==============*/
global.info = {
	nomorbot: '62882257504889',
	nomorown: '16312176248',
	namebot: 'ncoss',
	nameown: 'ncoss',
	channel: '120363241570452835@newsletter',
	namechannel: 'ncoss | Whatsapp Bots'
}

/*============== OWNER ==============*/
global.owner = [global.info.nomorown, '16312176248']
global.xmaze = [global.info.nomorown, '16312176248']
global.mods = []
global.prems = []

/*============== API ==============*/

global.APIKeys = {
  'https://api.betabotz.eu.org': global.btz
}

/*============== WATERMARK ==============*/
global.wm = 'ncos'
global.author = 'ncos'
global.stickpack = 'ncos'
global.stickauth = 'ncos'
global.multiplier = 38 // The higher, The harder levelup

/*============== NO EDIT ==============*/
global.maxwarn = '5'
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

/*========== TEXT & THUMBNAIL ==========*/
global.nameown = 'ncoss'
global.waown = 'wa.me/628159994194'
global.mail = 'kardithea000@gmail.com'
global.fb = 'https://facebook.com/jajang.pascal'
global.ig = 'https://instagram.com/encos_thea233'
global.gcbot = 'https://whatsapp.com/channel/0029VaL28ZqFSAtCdSU5EX0M'
global.wait = '*Starting Processing . . .*'
global.eror = '*Failed to process . . .*\n\nLapor Owner dengan menulis \`.lapor\`\nReport Owner by writing \`.report\`'
global.qris = 'https://telegra.ph/file/f11ccd2ca8a5136aacfb3.jpg'
global.pricelist = '*Limit kamu habis. Kamu bisa order akses premium dengan menulis* \`.order\`'
global.thumvid = 'https://github.com/XM4ZE/DATABASE/raw/refs/heads/master/wallpaper/VID-20250116-WA0207.mp4'
global.xmenus = 'https://raw.githubusercontent.com/XM4ZE/DATABASE/master/wallpaper/menus.json' // Json thumbnail simple menu
global.thum = 'https://telegra.ph/file/8ddbb1905c4f3357bf82c.jpg'

/*=========== AUDIO ALLMENU ===========*/
global.vn = 'https://github.com/XM4ZE/DATABASE/raw/master/wallpaper/XMcodes.mp3' // Allmenu audio

/*=========== TYPE DOCUMENT ===========*/
global.doc = {
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    rtf: 'text/rtf'
}

global.xmyulamd = '@lid'

/*========== HIASAN ===========*/
global.decor = {
	menut: '❏═┅═━–〈',
	menub: '┊•',
	menub2: '┊',
	menuf: '┗––––––––––✦',
	hiasan: '꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷',

	menut: '––––––『',
    menuh: '』––––––',
    menub: '┊☃︎ ',
    menuf: '┗━═┅═━––––––๑\n',
	menua: '',
	menus: '☃︎',

	htki: '––––––『',
	htka: '』––––––',
	haki: '┅━━━═┅═❏',
	haka: '❏═┅═━━━┅',
	lopr: 'Ⓟ',
	lolm: 'Ⓛ',
	htjava: '❃'
}

global.elainajpg = [
    'https://telegra.ph/file/3e43fcfaea6dc1ba95617.jpg',
    'https://telegra.ph/file/c738a9fc0722a59825cbb.mp4',
]
global.flaaa = [
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text='
]
global.hwaifu = [
    'https://i.pinimg.com/originals/ed/34/f8/ed34f88af161e6278993e1598c29a621.jpg',
    'https://i.pinimg.com/originals/85/4d/bb/854dbbd30304cd69f305352f0183fad0.jpg',
]

/*============== EMOJI ==============*/
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            level: '📊',
            limit: '🎫',
            health: '❤️',
            exp: '✨',
            atm: '💳',
            money: '💰',
            bank: '🏦',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🛍️',
            mythic: '🎁',
            legendary: '🗃️',
            superior: '💼',
            pet: '🔖',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐴',
            cat: '🐱',
            dog: '🐶',
            fox: '🦊',
            robo: '🤖',
            petfood: '🍖',
            iron: '⛓️',
            gold: '🪙',
            emerald: '❇️',
            upgrader: '🧰',
            bibitanggur: '🌱',
            bibitjeruk: '🌿',
            bibitapel: '☘️',
            bibitmangga: '🍀',
            bibitpisang: '🌴',
            anggur: '🍇',
            jeruk: '🍊',
            apel: '🍎',
            mangga: '🥭',
            pisang: '🍌',
            botol: '🍾',
            kardus: '📦',
            kaleng: '🏮',
            plastik: '📜',
            gelas: '🧋',
            chip: '♋',
            umpan: '🪱',
            skata: '🧩'
        }
        let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
        if (!results.length) return ''
        else return emot[results[0][0]]
    }
}

//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
