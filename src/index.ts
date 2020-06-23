import { uniq, concat } from 'ramda'
import stickeroos from "./data/sampleStickers.json"

import { createConnection, Entity, } from "typeorm";
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
interface KvPair {
	[key: string]: string
}

const upsertEntity = async <T extends Entity>(PlaceholderEntity: T, kvPair: KvPair) => {
	const saved = await PlaceholderEntity.find(kvPair)
	if (!saved.length) {
		const newEntity = Object.assign(new PlaceholderEntity(), kvPair)
		await newEntity.save()
		return newEntity
	} else {
		return saved
	}
}
		
const join = (a1: any[], a2: any[]) => uniq(concat(a1 || [], a2 || []))

const saveSticker = async ({ fileId, keywords, emojis }: RawSticker) => {	
	const sticker = (await Sticker.findOne({fileId})) || new Sticker()

	const savedKeywords = await Promise.all(keywords.map(keyword =>
		upsertEntity(StickerKeyword, {keyword})))

	const savedEmojis = await Promise.all(emojis.map(emoji =>
		upsertEntity(StickerEmoji, {emoji})))
	sticker.fileId = fileId
	sticker.keywords = join(sticker.keywords, savedKeywords)
	sticker.emojis = join(sticker.emojis, savedEmojis)
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
	// const res = await StickerEmoji.find()
  const res = await StickerEmoji.find({ relations: ['stickers'], where: { emoji: '😳' }})
  console.log(res)
}).catch(console.error);