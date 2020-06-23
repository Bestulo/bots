import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import { Sticker } from "./Sticker"

@Entity()
export class StickerEmoji extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    emoji: string;

    @ManyToMany(type => Sticker, sticker => sticker.emojis)
    @JoinTable()
    sticker: Sticker[];

}