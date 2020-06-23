import { concat } from 'ramda'
import stickeroos from "./data/sampleStickers.json"

import { createConnection, Entity, getConnection } from "typeorm";
import { Sticker } from "./entity/Sticker";
import { StickerEmoji } from "./entity/StickerEmoji";
import { StickerKeyword } from "./entity/StickerKeyword";

const entities = [ Sticker, StickerEmoji, StickerKeyword ];
export type Entity = (typeof entities)[number];
interface RawSticker {
  fileId: string,
  keywords: string[],
  emojis: string[]
}

const saveSticker = async ({ fileId, keywords, emojis }: RawSticker) => {	
	const sticker = new Sticker()
	const kewordsInProgress = keywords.map(keyword =>
		Object.assign(new StickerKeyword(), {keyword}))
	const emojisInProgress = emojis.map(emoji => 
		Object.assign(new StickerEmoji(), {emoji}))
	sticker.fileId = fileId
	sticker.keywords = concat(sticker.keywords || [], kewordsInProgress)
	sticker.emojis = concat(sticker.emojis || [], emojisInProgress)
	const save = (n: any) => n.save()
	await Promise.all([...kewordsInProgress.map(save), ...emojisInProgress.map(save)])
	return sticker.save()
}

createConnection({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: true,
  entities
})
.then(() => Promise.all(stickeroos.map(saveSticker)))
.then(async () => {
	// const res = Sticker.find()
  const res = await StickerEmoji.find({ relations: ['sticker'], where: { emoji: '😳' }})
  console.log(await res)
}).catch(console.error);