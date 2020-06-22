import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Sticker extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileId: string;

    @Column()
    keywords: string[];

    @Column()
    emojis: string[];

}