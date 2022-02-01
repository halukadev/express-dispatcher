import { Express } from 'express';
import { RouterDispatcher } from '@haluka/routing';
import { IRouterDispatcher } from '@haluka/routing/build/Routing/RoutingEssentials';
export default abstract class ExpressDispatcher extends RouterDispatcher<Express> implements IRouterDispatcher {
    create(): Express;
    dispatch(express: Express): Express;
    abstract onRequest(req: any, res: any): void;
    abstract onResponse(req: any, res: any, output: any): void;
    abstract errorHandler(err: any, req: any, res: any, next: any): any;
    protected wrap(action: Function): (req: any, res: any, next: CallableFunction) => Promise<void>;
}
