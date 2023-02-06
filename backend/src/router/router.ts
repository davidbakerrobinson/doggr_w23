import {PathHandler} from "./pathHandler";
import {Route} from "./route";

export class Router {
    // This is PathHandler FOR A REASON!  We're caching this in the router for performance
    // let this be a lesson - being clever is awful for maintainers
    // stack.forEach( (r) => if (r.path === reqPath) then execute handler
    private stack: PathHandler[];

    constructor() {
        this.stack = [
            new PathHandler("*", (req, res) => {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Cannot find ${req.url}`);
            }),
        ]
    }

    // iterate through PathHandlers looking for a matching path with request path
    // If it has a routehandler with it, the route handler will be executed
    handle(req, res) {
        const method = req.method;
        let found = false;

        this.stack.some( (item, index) => {
            if (index === 0 ) {
                return false;
            }

            const { matched = false, params = {} } = item.match(req.pathname);

            if (matched && item.route && item.route.requestHandler(method)) {
                found = true;
                req.params = params;
                return item.handler(req, res);
            }
        });

        return found ? null : this.stack[0].handler(req, res);
    }

    createRoute(path) {
        const route = new Route(path);
        const layer = new PathHandler(path, (req, res) => route.dispatch(req, res));
        layer.route = route;
        this.stack.push(layer);

        return route;
        // const route = new Route(path);
        // const ph = new PathHandler(path, (req, res) => route.dispatch(req, res));
        // ph.route = route;
        // this.stack.push(route);
        //
        // return route;
    }

    get(path, handler) {
        const route = this.createRoute(path);
        route.get(handler);
        return this;
    }

    put(path, handler) {
        const route = this.createRoute(path);
        route.put(handler);
        return this;
    }

    delete(path, handler) {
        const route = this.createRoute(path);
        route.delete(handler);
    }

    post(path, handler) {
        const route = this.createRoute(path);
        route.post(handler);
    }


}
