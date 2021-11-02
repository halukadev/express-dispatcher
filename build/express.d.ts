import { Express } from 'express';
import { RouterDispatcher } from '@haluka/routing';
import { IRouterDispatcher } from '@haluka/routing/build/Routing/RoutingEssentials';
export default class ExpressDispatcher extends RouterDispatcher<Express> implements IRouterDispatcher {
    create(): Express;
    dispatch(express: Express): Express;
    onRequest(req: any, res: any): void;
    onResponse(req: any, res: any, output: any): void;
    protected wrap(action: Function): (req: any, res: any) => void;
}
