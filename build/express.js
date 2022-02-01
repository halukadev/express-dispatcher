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
        express.use(function (_req, _res, next) {
            next(createError(404));
        });
        express.use((err, req, res, next) => {
            let resp = this.errorHandler(err, req, res, next);
            if (!resp)
                return next(err);
            next(resp);
        });
        return express;
    }
    wrap(action) {
        return async (req, res, next) => {
            try {
                // To provide custom request handlers
                this.onRequest(req, res);
                // Execute the action
                let ret = await action({ req, res, Request: req, Response: res });
                // TODO: fallback handler (when no response is sent)
                // To provide custom response handlers
                this.onResponse(req, res, ret);
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