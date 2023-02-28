/** @module Seeds/Profile */

import {faker} from "@faker-js/faker";
import {Seeder} from "../../lib/seed_manager";
import {Profile} from "../models/profile";
import {User} from "../models/user";
import {Matches} from "../models/matches";
import {FastifyInstance} from "fastify";
import {Matches1677293036162} from "../migrations/1677293036162-Matches";

// note here that using faker makes testing a bit...hard
// We can set a particular seed for faker, then use it later in our testing!
faker.seed(100);

/**
 * Seeds the ip_history table
 */
export class MatchesSeeder extends Seeder {

	/**
     * Runs the Matches table's seed
     * @function
     * @param {FastifyInstance} app
     * @returns {Promise<void>}
     */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Matches...");
		// Remove everything in there currently
		await app.db.matches.delete({});
		// get our users and make each a few IPs
		const profiles = await Profile.find();

		//have profile swipe right on profile found one index over
		for (let i = 0; i < profiles.length; i++) {
			let newMatch = new Matches();
			// let newMatch2 = new Matches();
			let j = (i+5) % (profiles.length-1);
			newMatch.matcherID = profiles[i];
			newMatch.matcheeID = profiles[j];
			await newMatch.save();
			// let l = (i+2) % (profiles.length-1);
			// newMatch2.matcherID = profiles[l];
			// newMatch2.matcheeID = profiles[i];
			// await newMatch2.save();
			app.log.info("Finished seeding matcher: " + profiles[i]);
		}
	}
}

export const MatchesSeed = new MatchesSeeder();
