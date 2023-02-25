import { MigrationInterface, QueryRunner } from "typeorm";

export class Matches1677293036162 implements MigrationInterface {
    name = 'Matches1677293036162';

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`CREATE TABLE "matches" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "matcheeIDId" integer, "matcherIDId" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
    	await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_72512b35a002a38918c46af1d8f" FOREIGN KEY ("matcheeIDId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    	await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_b41518f3c5bb086708e62a4c024" FOREIGN KEY ("matcherIDId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_b41518f3c5bb086708e62a4c024"`);
    	await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_72512b35a002a38918c46af1d8f"`);
    	await queryRunner.query(`DROP TABLE "matches"`);
    }

}
