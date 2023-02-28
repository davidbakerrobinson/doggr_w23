/** @module Models/messages */
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinColumn, JoinTable,
	ManyToMany,
	ManyToOne, PrimaryColumn,
	PrimaryGeneratedColumn,
	Relation
} from "typeorm";

import {Profile} from "./profile";

/**
 * This is for messaging between users profiles
 * The entity will have a generatedId, a textField, and a generated created_at date
 * Two ManytoOne keys
 */

@Entity()
export class Messages extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({type: "text"})
	message: string;

	@ManyToOne(()=>Profile, (profile)=> profile.messageSenders, {
		cascade: true,
		onDelete: "CASCADE"
	})
	messageSender: Relation<Profile>;

	@ManyToOne(()=>Profile, (profile)=>profile.messageReceivers, {
		cascade: true,
		onDelete: "CASCADE"
	})
	messageReceiver: Relation<Profile>;

	@CreateDateColumn()
	sent_at: string;
}