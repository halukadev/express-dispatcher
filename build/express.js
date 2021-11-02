"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routing_1 = require("@haluka/routing");
class ExpressDispatcher extends routing_1.RouterDispatcher {
    create() {
        let app = express();
        return app;
    }
    dispatch(express) {
        for (const route of this.load()) {
            let middlewares = route.middlewares.map(m => {
                return ExpressMiddleware.make(m);
            });
            route.methods.forEach(method => {
                // TODO: where routing [conditions]
                express[method.toLowerCase()](route.uri, ...middlewares, this.wrap(route.compiledAction));
            });
        }
        return express;
    }
    onRequest(req, res) {
        //
    }
    onResponse(req, res, output) {
        //
    }
    wrap(action) {
        return (req, res) => {
            this.onRequest(req, res);
            let ret = action({ req, res, Request: req, Response: res });
            if (!res.headersSent) {
                res.end(ret);
            }
            this.onResponse(req, res, ret);
        };
    }
}
exports.default = ExpressDispatcher;
class ExpressMiddleware {
    static make(middleware) {
        if (middleware instanceof Function) {
            //return (req: any, res: any, next: Function) => {
            return middleware;
        }
        else {
            throw new TypeError(`Feature not implemented`);
        }
    }
}
//# sourceMappingURL=express.js.map