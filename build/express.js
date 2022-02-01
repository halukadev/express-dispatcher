"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const createError = require("http-errors");
const routing_1 = require("@haluka/routing");
globalThis.httpError = createError;
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
        // For Handling 404
        express.use(async (req, res, next) => {
            // To provide custom request handlers
            await this.onRequest(req, res);
            next(createError(404));
        });
        express.use(async (err, req, res, next) => {
            res.status(err.status);
            let resp = await this.errorHandler(err, req, res, next);
            await this.onResponse(req, res, resp);
            if (!res.writableEnded) {
                if (!resp)
                    res.send(err);
                res.send(resp);
            }
        });
        return express;
    }
    wrap(action) {
        return async (req, res, next) => {
            try {
                // To provide custom request handlers
                await this.onRequest(req, res);
                // Execute the action
                let ret = await action({ req, res, Request: req, Response: res });
                // TODO: fallback handler (when no response is sent)
                if (!res.writableEnded) {
                    if (ret)
                        return res.send(ret);
                    res.end(`Action for this route sent empty response.`);
                }
                // To provide custom response handlers
                await this.onResponse(req, res, ret);
            }
            catch (error) {
                next(createError(error));
            }
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