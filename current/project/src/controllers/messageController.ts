// 3RD PARTY PACKAGES
import { Router, Request, Response } from "express";

import { getConversationService, getConversationsHeadsService, insertMessageService } from "../services/messageServices";
import { insertMessageDTO } from "../dto/messageController/insertMessageDTO";
import { getConversationDTO } from "../dto/messageController/getConversationDTO";

export const messageController = Router();


messageController.post('/insertMessageControl', async (req: Request, res: Response) => {
    const status = await insertMessageService(req.body as insertMessageDTO);
    res.status(status).send();
});

messageController.post('/getConversationsHeadsControl', async (req: Request, res: Response) => {
    const tempIdentifier = '123456789';
    const object = await getConversationsHeadsService(tempIdentifier);
    res.send('ok');
});

messageController.post('/getConversationControl', async (req: Request, res: Response) => {
    const tempIdentifier = '123456789';
    const object = await getConversationService(tempIdentifier, req.body as getConversationDTO);
    res.send('ok');
});