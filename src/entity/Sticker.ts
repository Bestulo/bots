import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { StickerEmoji } from './StickerEmoji';
import { StickerKeyword } from './StickerKeyword';

@Entity()
export class Sticker extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	fileId: string;

	@ManyToMany(() => StickerEmoji, emoji => emoji.stickers)
	@JoinTable()
	emojis: StickerEmoji[];

	@ManyToMany(() => StickerKeyword, keyword => keyword.stickers)
	@JoinTable()
	keywords: StickerKeyword[];
}
