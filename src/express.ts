import * as express from 'express'
import { Express } from 'express'
import { RouterDispatcher } from '@haluka/routing'
import { IRouterDispatcher } from '@haluka/routing/build/Routing/RoutingEssentials'

export default class ExpressDispatcher extends RouterDispatcher<Express> implements IRouterDispatcher {

    create (): Express {
        let app =  express()
        return app
    }

    dispatch (express: Express): Express {
        for (const route of this.load()) {
            let middlewares = route.middlewares.map(m => {
                return ExpressMiddleware.make(m)
            })

            route.methods.forEach(method => {
                // TODO: where routing [conditions]
                express[method.toLowerCase()](route.uri, ...middlewares, this.wrap(route.compiledAction)) 
            });
		}
		return express
    }

    onRequest (req, res) {
        //
    }

    onResponse (req, res, output) {
        //
    }

    protected wrap (action: Function) {
        return (req: any, res: any) => {
            this.onRequest(req, res)
            let ret = action({req, res, Request: req, Response: res})
            if (!res.headersSent) {
                res.end(ret)
            }
            this.onResponse(req, res, ret)
        }
    }

}

class ExpressMiddleware {

    static make (middleware: string | Function): Function {
        if (middleware instanceof Function) {
            //return (req: any, res: any, next: Function) => {
                return middleware as Function
        }else {
            throw new TypeError(`Feature not implemented`);
        }
    }

}