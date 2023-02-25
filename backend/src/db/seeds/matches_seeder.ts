/** @module Seeds/Profile */

import {faker} from "@faker-js/faker";
import {Seeder} from "../../lib/seed_manager";
import {Profile} from "../models/profile";
import {User} from "../models/user";
import {Matches} from "../models/matches";
import {FastifyInstance} from "fastify";

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
			let j = i % (profiles.length-1);
			newMatch.matcherID = profiles[i];
			newMatch.matcheeID = profiles[j];
			await newMatch.save();
			app.log.info("Finished seeding matcher: " + profiles[i]);
		}
	}
}

export const MatchesSeed = new MatchesSeeder();