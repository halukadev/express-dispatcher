import { Express } from 'express';
import { RouterDispatcher } from '@haluka/routing';
import { IRouterDispatcher } from '@haluka/routing/build/Routing/RoutingEssentials';
export default abstract class ExpressDispatcher extends RouterDispatcher<Express> implements IRouterDispatcher {
    create(): Express;
    dispatch(express: Express, timeout?: number): Express;
    abstract onRequest(req: any, res: any): any;
    abstract onResponse(req: any, res: any, output: any): any;
    abstract errorHandler(err: any, req: any, res: any, next: any): any;
    protected wrap(action: Function, timeout?: number): (req: any, res: any, next: CallableFunction) => Promise<void>;
}
