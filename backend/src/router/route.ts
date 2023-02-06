/*We want to create a Route with path: "/login" and store the processing fn handler provided with it - we'll put this handler in a PathHandler

Our Route is also going to store info about the current method in a set.
We'll use this later to determine if we have a handler for a particular path/method pair when a request comers in later
*/

// doggr.com/admin POST GET
import {PathHandler} from "./pathHandler";

type MethodMap = {
    [id:string]: boolean
}

// let foo = new Route();
// foo === this

export class Route {
    path: string;
    // all of the handlers that apply SPECIFICALLY TO THIS PATH ^
    stack: PathHandler[];

    // [id:string]: boolean
    methods: MethodMap;

    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }

    get(handler) {
        const ph = new PathHandler("/", handler);
        ph.method = "get";

        this.methods['get'] = true;
        this.stack.push(ph);
        return this;
    }

    put(handler) {
        const ph = new PathHandler("/", handler);
        ph.method = "put";

        this.methods['put'] = true;
        this.stack.push(ph);
        return this;
    }

    post(handler) {
        const ph = new PathHandler("/", handler);
        ph.method = "post";

        this.methods['post'] = true;
        this.stack.push(ph);
        return this;
    }

    delete(handler) {
        const ph = new PathHandler("/", handler);
        ph.method = "delete";

        this.methods['delete'] = true;
        this.stack.push(ph);
        return this;
    }

    requestHandler(method) {
        const name = method.toLowerCase();

        // let FakeMethod = this.methods["HARRY"]
        // FakeMethod === null
        // return Boolean(null) => false
        return Boolean(this.methods[name]);
    }

    dispatch(req, res) {
        const method = req.method.toLowerCase();

        // Identical to forEach
        // for (let i = 0; i < this.stack.length; i++) {
        //     if (method === this.stack[i]) {
        //         this.stack[i].requestHandler(req, res);
        //     }
        // }

        this.stack.forEach( (item) => {
            if (method === item.method) {
                item.requestHandler(req, res);
            }
        })
    }


}


