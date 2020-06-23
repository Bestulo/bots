import { createConnection } from "typeorm";
import { Sticker } from "./entity/Sticker";
import { StickerEmoji } from "./entity/StickerEmoji";
import { StickerKeyword } from "./entity/StickerKeyword";

const entities = [ Sticker, StickerEmoji, StickerKeyword ];
export type Entity = (typeof entities)[number];

const stickeroos = [{
  fileId: "CAACAgEAAxkBAAETflVe8SfXeDd2peGuobT-BJubVrinDgACagoAAsWGLA4FXfhJaaPZcxoE",
  keywords: ["wow", "openmouth"],
  emojis: ["😳"]
},{
  fileId: "CAACAgEAAxkBAAETflZe8SfXZ_O3yczm8v0mxFeeX5L9EQACawoAAsWGLA7lyputjasLpBoE",
  keywords: ["cool", "ok","excellent"],
  emojis: ["👌", "👍"]
},{
  fileId: "CAACAgEAAxkBAAETflde8SfXKGize36OZ69036CMF-1LDAACbAoAAsWGLA567Ca66q3g2BoE",
  keywords: ["omg", "pervert","damn"],
  emojis: ["😱", "😨"]
}]

const conn = createConnection({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: true,
  entities: [
    Sticker,
    StickerEmoji,
    StickerKeyword
  ]
}).then(async () => {

  const savedStickers = stickeroos.map(async sticka => {

    const sticker = new Sticker();

    sticker.fileId = sticka.fileId

    const promiseArray: any[] = []

    sticker.emojis = sticka.emojis.map(emoji => {
      const entry = Object.assign(new StickerEmoji(), {emoji})
      promiseArray.push(entry)
      return entry
    })

    sticker.keywords = sticka.keywords.map(keyword => {
      const entry = Object.assign(new StickerKeyword(), {keyword})
      promiseArray.push(entry)
      return entry
    })
    
    return Promise
      .all(
        promiseArray.map(entry => entry.save())
      ).then(() => sticker.save())
  })
  return Promise.all(savedStickers)
}).then(async () => {
    
    const sticker = await StickerEmoji.find({ relations: ['sticker'], where: { emoji: '😳' }})
    console.log(sticker)
});