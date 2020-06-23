import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import { Sticker } from "./Sticker"

@Entity()
export class StickerKeyword extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    keyword: string;

    @ManyToMany(type => Sticker, sticker => sticker.keywords)
    @JoinTable()
    sticker: Sticker[];

}