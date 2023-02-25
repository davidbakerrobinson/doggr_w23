/** @module Models/matches */
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinTable,
	ManyToMany,
	ManyToOne, PrimaryColumn,
	PrimaryGeneratedColumn,
	Relation
} from "typeorm";

import {Profile} from "./profile";

/**
 * This is for matching users profiles
 * The Entity will have a primary key composed of the
 * two foreign keys: matcherID, matcheeID
 * *So two ManytoOne keys
 */

@Entity()
export class Matches extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Profile, (profile) => profile.swipedRightOn, {
    	cascade: true,
    	onDelete: "CASCADE"
    })
    matcheeID: Relation<Profile>;
    @ManyToOne(() => Profile, (profile) => profile.swipedRight, {
    	cascade: true,
    	onDelete: "CASCADE"
    })
    matcherID: Relation<Profile>;

    @CreateDateColumn()
    created_at: string;

}