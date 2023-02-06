
import * as dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import fs from "fs/promises";
import path from "path";
import {Nastify} from "./nastify";
//import { Fastify } from "./fastify";

const app = new Nastify();

console.log(app);

app.use("/about", cors());
app.use("/get", cors());

app.get("/about", (req, res) => {
    res.send("I am the about page");
});

app.post("/about", (req, res) => {
    res.send("I am POST REQUEST");
})

app.get("/users", (req, res) => {

})

app.put("/users", (req,res) => {
    console.log("We came, we saw, we put put golfed");
    res.send('Been there, done that.');
});

app.delete("/users", (req,res)=> {
   console.log("My name a Borat, I not be delete");
   res.send("My name a Borat, I not be delete");
});

/*

app.get('/users", (req, res) => {

}

app.post('/users", (req, res) => {

}

app.put('/users", (req, res) => {

}
 */

app.get("/", async (req, res) => {

    const indexFile = await fs.readFile(path.resolve(__dirname, 'public', 'index.html'))
        .catch(err => {
            console.error(err);
            //send error result - 500!
            res.setHeader('Content-Type', 'text/html');
            res.status(500).send("Error occurred", err);
        });

    res.status(200).send(indexFile);
});

app.get('/get', async (req, res) => {
    const indexFile = await fs.readFile(path.resolve(__dirname, 'public', 'index.html'))
        .catch(err => {
            console.error(err);
            //send error result - 500!
            res.setHeader('Content-Type', 'text/html');
            return res.status(500).send("Error occurred", err);

        });

    return res.status(200).send(indexFile);
});

async function main() {
    const server = await app.listen(8080, () => {
        console.log("Server is running");
    });
}

void main();

// import {App} from "./app";
// import {FastifyInstance} from "fastify";
//
// const app: FastifyInstance = App({
//     logger: {
//         level: 'info',
//         transport: {
//             target: 'pino-pretty'
//         }
//     }
// });
//
//
// const host_addr = '0.0.0.0';
// app.listen({port: 3000, host: host_addr},
//     (err, _address) => {
//         if (err) {
//             app.log.error(err);
//             process.exit();
//         }
//         const msg = `Server listening on '${host_addr}' ...`;
//         console.log(msg);
//         app.log.info(msg);
//     });
