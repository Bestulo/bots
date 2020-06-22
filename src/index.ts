import * as fs from 'fs-extra'

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
  entities: [
    Sticker,
    StickerEmoji,
    StickerKeyword
  ]
}).then(() => {

  const savedStickers = stickeroos.map(async sticka => {

    const sticker = new Sticker();

    sticker.fileId = sticka.fileId

    sticker.emojis = sticka.emojis.map(emoji =>
      Object.assign(new StickerEmoji(), emoji))

    sticker.keywords = sticka.keywords.map(keyword =>
      Object.assign(new StickerKeyword(), keyword))

    await sticker.save()
  })

  Promise.all(savedStickers).then(() => {
    const allStickers = Sticker.find()
    console.log(allStickers)
  })

});

console.log(fs.readFileSync('nodemon.json', 'utf8'))