import * as fs from 'fs-extra'

import {createConnection} from "typeorm";
import {Sticker} from "./entity/Sticker";

const stickeroos: Partial<Sticker>[] = [{
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

stickeroos.forEach(sticka => {
  const sticker = new Sticker();
  for (let prop in Object.keys(sticka)) {
    sticker[prop as keyof Sticker] = sticka[prop as keyof Sticker]
  }
})

// createConnection({
//   type: 'sqlite',
//   database: 'db.sqlite'
// }).then(async cunt => {
// 	cunt.
// }).catch(error => console.log(error));

console.log(fs.readFileSync('nodemon.json', 'utf8'))