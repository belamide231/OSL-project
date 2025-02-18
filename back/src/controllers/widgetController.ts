import { Router, Request, Response, static as static_ } from "express";
import path from "path";

export const widgetController = Router();
widgetController
.use(static_(path.join(__dirname, '../../public/widget/browser')));

widgetController
.get('/widget/chat', (req: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, '../../public/widget/browser/index.html'));
})