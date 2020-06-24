import stickeroos from './data/sampleStickers.json';

import { createConnection, BaseEntity, Repository, Connection } from 'typeorm';
import { Sticker } from './entity/Sticker';
import { StickerEmoji } from './entity/StickerEmoji';
import { StickerKeyword } from './entity/StickerKeyword';

const entities = [Sticker, StickerEmoji, StickerKeyword];
interface RawSticker {
	fileId: string;
	keywords: string[];
	emojis: string[];
}
interface KvPair {
	[key: string]: string;
}

const upsert = async <Repo extends Repository<Ent>, Ent extends BaseEntity>(
	repo: Repo,
	entity: Ent,
	field: Exclude<keyof Ent, keyof BaseEntity>
) => {
	const existing = await repo.findOne({ where: { [field]: entity[field] } });
	if (existing) {
		return existing;
	}
	return entity.save();
};

const saveSticker = async (
	{ fileId, keywords, emojis }: RawSticker,
	conn: Connection
) => {
	const sticker = new Sticker();
	sticker.fileId = fileId;
	sticker.keywords = await Promise.all(
		keywords.map(keyword =>
			upsert(
				conn.getRepository(StickerKeyword),
				Object.assign(new StickerKeyword(), { keyword }),
				'keyword'
			)
		)
	);
	sticker.emojis = await Promise.all(
		emojis.map(emoji =>
			upsert(
				conn.getRepository(StickerEmoji),
				Object.assign(new StickerEmoji(), { emoji }),
				'emoji'
			)
		)
	);
	return upsert(conn.getRepository(Sticker), sticker, 'fileId');
};

createConnection({
	type: 'sqlite',
	database: 'db.sqlite',
	synchronize: true,
	logging: true,
	entities
})
	.then(conn => Promise.all(stickeroos.map(s => saveSticker(s, conn))))
	.then(async () => {
		// const res = await StickerEmoji.find()
		const res = await StickerEmoji.find({
			relations: ['stickers'],
			where: { emoji: '😳' }
		});
		console.log(res[0].stickers[0]);
	})
	.catch(console.error);
