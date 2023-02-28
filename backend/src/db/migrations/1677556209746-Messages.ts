import { MigrationInterface, QueryRunner } from "typeorm";

export class Messages1677556209746 implements MigrationInterface {
    name = 'Messages1677556209746';

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "message" text NOT NULL, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "messageSenderId" integer, "messageReceiverId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
    	await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_f7edb057372f98fd63bef74e110" FOREIGN KEY ("messageSenderId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    	await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_cc2989650c4ffdb71209997ce7d" FOREIGN KEY ("messageReceiverId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_cc2989650c4ffdb71209997ce7d"`);
    	await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f7edb057372f98fd63bef74e110"`);
    	await queryRunner.query(`DROP TABLE "messages"`);
    }
}
