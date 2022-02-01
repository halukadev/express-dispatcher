import * as express from 'express'
import { Express } from 'express'
import * as createError from 'http-errors'
import { RouterDispatcher } from '@haluka/routing'
import { IRouterDispatcher } from '@haluka/routing/build/Routing/RoutingEssentials'

globalThis.httpError = createError

export default abstract class ExpressDispatcher extends RouterDispatcher<Express> implements IRouterDispatcher {

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

        // For Handling 404
        express.use(async (req: any, res: any, next: any) => {
            // To provide custom request handlers
            await this.onRequest(req, res)
            next(createError(404))
        })

        express.use(async (err: any, req: any, res: any, next: any) => {
            let resp = await this.errorHandler(err, req, res, next)
            await this.onResponse(req, res, resp)
            if (!res.writableEnded) {
                if (!resp) res.send(err);
                res.send(resp);
            }
        })

		return express
    }

    abstract onRequest (req: any, res: any): any

    abstract onResponse (req: any, res: any, output: any): any

    abstract errorHandler (err: any, req: any, res: any, next: any): any

    protected wrap (action: Function) {
        return async (req: any, res: any, next: CallableFunction) => {
            try {
                // To provide custom request handlers
                await  this.onRequest(req, res)
                // Execute the action
                let ret = await action({req, res, Request: req, Response: res})

                // TODO: fallback handler (when no response is sent)

                // To provide custom response handlers
                await this.onResponse(req, res, ret)
            } catch (error) {
                next(createError(error))
            }
            
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