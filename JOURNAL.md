I spent a lot of time starting off figuring out what the doggr backend was actually doing. This involved going through
the class modules as well as Typeorm, TypeScript, and Fastify docs. I have a much bigger appreciation for our setup! 
It's so cool being able to more precisely define routes with typescript and shorthand options, provide easy, functional
access to all stages of database interaction, and testing routes with vitest allowing the routing logic to be tested
without the need of a server running! I used Postman to test most of my routes, and made a test for one of them. I
had some moments of going down the rabbit hole, trying to use typeorm's QueryBuilder, but with very little success and
eventually found the much more direct approach of using find. I feel like I have a better understanding of how typeorm
is generating SQL from specified decorators using migrations and the commands necessary to make that happen. It was fun
starting to implement messages because I knew how to do everything already, but alas I didn't have a time to implement 
all of the routes and the bad word checker. I didn't do the soft delete bonus, but I will definetly try to implement
that in my final project using typeOrms api.