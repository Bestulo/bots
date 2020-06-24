import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany
} from 'typeorm';
import { Sticker } from './Sticker';

@Entity()
export class StickerKeyword extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	keyword: string;

	@ManyToMany(() => Sticker, sticker => sticker.keywords)
	stickers: Sticker[];
}
