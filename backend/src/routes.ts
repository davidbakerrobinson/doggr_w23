/** @module Routes */
import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {User} from "./db/models/user";
import {IPHistory} from "./db/models/ip_history";
import {Profile} from "./db/models/profile";
import {Matches} from "./db/models/matches";
import {EntityNotFoundError} from "typeorm";
import * as repl from "repl";
import {Messages} from "./db/models/messages";
import { getDirName } from "./lib/helpers";

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function doggr_routes(app: FastifyInstance): Promise<void> {

	// Middleware
	// TODO: Refactor this in favor of fastify-cors
	app.use(cors());

	/**
	 * Route replying to /test path for test-testing
	 * @name get/test
	 * @function
	 */
	app.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send("GET Test");
	});

	/**
	 * Route serving login form.
	 * @name get/users
	 * @function
	 */
	app.get("/users", async (req, reply) => {
		let users = await app.db.user.find();
		reply.send(users);
	});

	app.get("/matches", async  (req,reply)=> {
		let myAns = await app.db.matches.find({
			relations: {
				matcheeID: true,
				matcherID: true
			}
		});

		reply.send(myAns);
	});
	//CRUD impl for Matches
	//Create new match

	//I am a humble follower of the high priest
	const post_matches_opts: RouteShorthandOptions = {
		schema: {
			body: {
				type: 'object',
				properties: {
					matcherId: {type: 'number'},
					matcheeId: {type: 'number'}
				}
			},
			response: {
				200: {
					type: 'object',
					properties: {
						match: {type: 'object'}
					}
				},
				416: {
					type: 'object',
					properties: {
						errorMessage: {type: 'string'}
					}
				}
			}
		}
	};
	app.post<{
		Body: MatchPostBody,
		Reply: MatchPostReply
	}>("/match", post_matches_opts ,async (req,reply: FastifyReply)=> {
		const {matcherId, matcheeId} = req.body;

		//need to test
		try {
			let matcheeProfile: Profile = await app.db.profile.findOneOrFail({
				where: {
					id: matcherId
				}
			});
			let matcherProfile: Profile = await app.db.profile.findOneOrFail({
				where: {
					id: matcheeId
				}
			});
			const match = new Matches();
			match.matcherID = matcherProfile;
			match.matcheeID = matcheeProfile;
			await match.save();

			await reply.send(JSON.stringify({match}));
		} catch(e: any) {
			reply.statusCode = 416;
			await reply.send(JSON.stringify({errorMessage: e.message}));
		}
	});
	/**
	 * Delete specific match with given ids
	 */

	app.delete("/match/:matcherId/:matcheeId",async (req, reply: FastifyReply)=> {
		const { matcherId, matcheeId } = req.params as MatchDeleteBody;
		try {
			let matchTableId = await app.db.matches.findOneOrFail({
				relations: {
					matcheeID: true,
					matcherID: true
				},
				where: {
					matcheeID: {
						id: matcheeId
					},
					matcherID: {
						id: matcherId
					}
				}
			});
			await app.db.matches.delete(matchTableId.id);
			await reply.send(JSON.stringify({deletedMatch: matchTableId}));
		} catch(err: any) {
			await reply.send(`Could not delete because match not found with matcherID: ${matcherId} and matcheeID: ${matcheeId}`);
		}
	});

	/**
	 * provide type information for typescript
	 */
	interface MatchesDeleteRequest {
		matcherId: number
	}

	/**
	 * Delete all matches with the given matcherId
	 */

	app.delete<{
		Params: MatchesDeleteRequest
	}>("/matches/:matcherId", async (req, reply: FastifyReply) => {
		const { matcherId } = req.params;
		if(matcherId == undefined) {
			return reply.status(400).send("matcherId must be a number");
		}
		//find those matches and delete accordingly
		let matchesToDelete = await app.db.matches.find({
			relations: {
				matcherID: true,
				matcheeID: true
			},
			where: {
				matcherID: {
					id: matcherId
				}
			}
		});
		await app.db.matches.remove(matchesToDelete);
		return reply.status(200).send(JSON.stringify({matcherID: matcherId, deletedMatches: matchesToDelete}));

	});





	interface MatchQueryParam {
		matcherId: number
	}

	/**
	 * Get all of the matches that Include the matcherId as the person who swipes right
	 */

	app.get("/match/:matcherId", async (req, reply: FastifyReply)=> {
		const { matcherId } = req.params as MatchQueryParam;
		if(matcherId == undefined) {
			return reply.send("For Route match Query parameter must be matcherId");
		}
		try {
			let matchedWith = await app.db.matches.find({
				relations: {
					matcherID: true,
					matcheeID: true
				},
				where: {
					matcherID: {
						id: matcherId
					}
				}
			});
			let profileEntry = await app.db.profile.findOneOrFail({
				where: {
					id: matcherId
				}
			});
			return reply.send(JSON.stringify({profile: profileEntry,selectedMatches: matchedWith}));
		} catch(err: any) {
			reply.statusCode = 416;
			return reply.send(JSON.stringify({errorMessage: `Not able to find profile with id: ${matcherId}`}));
		}
	});

	interface MatcheeQueryParam {
		matcheeId: number
	}

	/**
	 * Get all of the have that have the matcheeId as provided in the query
	 */
	app.get("/matchee/:matcheeId", async (req, reply: FastifyReply)=> {
		const { matcheeId } = req.params as MatcheeQueryParam;
		if(matcheeId == undefined) {
			return reply.send("For Route matchee Query parameter must be matcheeId");
		}
		try {
			let matchedWith = await app.db.matches.find({
				relations: {
					matcherID: true,
					matcheeID: true
				},
				where: {
					matcheeID: {
						id: matcheeId
					}
				}
			});
			let profileEntry = await app.db.profile.findOneOrFail({
				where: {
					id: matcheeId
				}
			});
			return reply.send(JSON.stringify({profile: profileEntry,selectedMatches: matchedWith}));
		} catch(err: any) {
			reply.statusCode = 416;
			return reply.send(JSON.stringify({errorMessage: `Not able to find profile with id: ${matcheeId}`}));
		}
	});

	// CRUD impl for users
	// Create new user

	// Appease fastify gods
	const post_users_opts: RouteShorthandOptions = {
		schema: {
			body: {
				type: 'object',
				properties: {
					name: {type: 'string'},
					email: {type: 'string'}
				}
			},
			response: {
				200: {
					type: 'object',
					properties: {
						user: {type: 'object'},
						ip_address: {type: 'string'}
					}
				}
			}
		}
	};



	/**
	 * Route allowing creation of a new user.
	 * @name post/users
	 * @function
	 * @param {string} name - user's full name
	 * @param {string} email - user's email address
	 * @returns {IPostUsersResponse} user and IP Address used to create account
	 */
	app.post<{
		Body: IPostUsersBody,
		Reply: IPostUsersResponse
	}>("/users", post_users_opts, async (req, reply: FastifyReply) => {

		const {name, email} = req.body;

		const user = new User();
		user.name = name;
		user.email = email;

		const ip = new IPHistory();
		ip.ip = req.ip;
		ip.user = user;
		// transactional, transitively saves user to users table as well IFF both succeed
		await ip.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify({user, ip_address: ip.ip}));
	});


	// PROFILE Route
	/**
	 * Route listing all current profiles
	 * @name get/profiles
	 * @function
	 */
	app.get("/profiles", async (req, reply) => {
		let profiles = await app.db.profile.find();
		reply.send(profiles);
	});


	app.post("/profiles", async (req: any, reply: FastifyReply) => {

		const {name} = req.body;

		const myUser = await app.db.user.findOneByOrFail({});

	  const newProfile = new Profile();
	  newProfile.name = name;
		newProfile.picture = "ph.jpg";
		newProfile.user = myUser;

		await newProfile.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(newProfile));
	});

	app.delete("/profiles", async (req: any, reply: FastifyReply) => {

		const myProfile = await app.db.profile.findOneByOrFail({});
		let res = await myProfile.remove();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

	app.put("/profiles", async(request, reply) => {
		const myProfile = await app.db.profile.findOneByOrFail({});


		myProfile.name = "APP.PUT NAME CHANGED";
		let res = await myProfile.save();

		//manually JSON stringify due to fastify bug with validation
		// https://github.com/fastify/fastify/issues/4017
		await reply.send(JSON.stringify(res));
	});

	/*
	Will put Messages routes here
	 */
	app.post<{
		Body: MessagesPostBody,
		Reply: MessagesPostReply,
		Params: MessagePostParams
	}>("/message/:messageSender/:messageReceiver", async(req,reply)=> {
		const { messageSender, messageReceiver } = req.params;
		const { message } = req.body;

		let senderProfile: Profile = await app.db.profile.findOneOrFail({
			where: {
				id: messageSender
			}
		});
		let receiverProfile: Profile = await app.db.profile.findOneOrFail({
			where: {
				id: messageReceiver
			}
		});
		const newMessage = new Messages();
		newMessage.message = message;
		newMessage.messageSender = senderProfile;
		newMessage.messageReceiver = receiverProfile;
		await newMessage.save();
		return reply.status(200).send({message: message});
	});

	app.get("/messages", async (req, reply)=> {
		let allMessages = await app.db.messages.find({
			relations: {
				messageSender: true,
				messageReceiver: true
			}
		});
		reply.send(allMessages);
	});
}

// Appease typescript request gods

interface MessagesPostBody {
	message: string
}

interface MessagePostParams {
	messageSender: number,
	messageReceiver: number
}

interface MessagesPostReply {
	message: string
}
interface IPostUsersBody {
	name: string,
	email: string,
}

/**
 * Response type for post/users
 */
export type IPostUsersResponse = {
	/**
	 * User created by request
	 */
	user: User,
	/**
	 * IP Address user used to create account
	 */
	ip_address: string
}

interface  MatchPostBody {
	matcherId: number,
	matcheeId: number
}

export type MatchPostReply = {
	match: Matches
}

interface MatchDeleteBody {
	matcherId: number,
	matcheeId: number
}

export type MatchDeleteReply = {
	deletedMatch: Matches,
}

interface MatcherGetBody {
	matcherId: number
}

export type MatcherGetReply = {
	profileWithMatcherRole: Profile
}
