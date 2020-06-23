import { concat } from 'ramda'
import stickeroos from "./data/sampleStickers.json"

import { createConnection } from "typeorm";
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

const saveEntry = (rawEntry: object, Table: Entity) => {
  const entry = Object.assign(new Table(), rawEntry)
  return entry.save()
}

const saveSticker = async ({ fileId, keywords, emojis }: RawSticker) => {
  const keywordsInProcess = keywords.map(keyword => saveEntry({ keyword }, StickerKeyword))
  const emojisInProcess = emojis.map(emoji => saveEntry({ emoji }, StickerEmoji))
  await Promise.all(concat(keywordsInProcess, emojisInProcess) as object[])
  console.log('IT HAS BEEN WAITED AFTER KEYWORDS AND EMOJIS')
  return saveEntry({ fileId }, Sticker)
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
    const sticker = await StickerEmoji.find({ relations: ['sticker'], where: { emoji: '😳' }})
    console.log(sticker)
}).catch(console.error);