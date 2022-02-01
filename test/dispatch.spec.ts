
import { Router } from '@haluka/routing'
import {default as FactoryExpressDispatcher} from '../src/express'
import * as request from 'supertest'
class Dispatcher extends FactoryExpressDispatcher {

    onRequest(req: any, res: any): void {
        // console.log(req.url)
    }

    onResponse(req: any, res: any, output: any): void {
        //
    }

    errorHandler(err: any, req: any, res: any, next: any): void {
        console.log(err.message)
        // next(err)
    }

}
let r = new Router({ path: './' })

r.get('/lol', ({res}) => res.myau.biralu()) // route with errors

let d = new Dispatcher(r , { path: './' })
let http = d.createAndDispatch()

describe ('GET /', () => {

    it('should respond with error 404', (done) => {
        request(http)
            .get('/')
            .expect(404, done)
            
    })

})

describe ('GET /lol', () => {

    it('should respond with error 500', (done) => {
        request(http)
            .get('/lol')
            .expect(500, done)
    })

})

