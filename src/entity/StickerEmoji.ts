import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany
} from 'typeorm';
import { Sticker } from './Sticker';

@Entity()
export class StickerEmoji extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	emoji: string;

	@ManyToMany(() => Sticker, sticker => sticker.emojis)
	stickers: Sticker[];
}
