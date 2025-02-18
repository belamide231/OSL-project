import { Router, Request, Response, static as static_ } from "express";
import path from "path";

export const widgetController = Router();
widgetController
.use(static_(path.join(__dirname, '../../public/widget/browser')));

const validDomains = [
    'http://localhost:3000',
    'http://www.ibcauto.com'
];

widgetController
.get('/widget/chat', (req: Request, res: Response): any => {
    return validDomains.some(x => req.headers.referer?.includes(x)) ? res.sendFile(path.join(__dirname, '../../public/widget/browser/index.html')) : res.sendStatus(401);
})