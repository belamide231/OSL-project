import { Router, Request, Response } from "express";

import { getActiveClientsService, sendMessageService, loadChatListServices, loadMessageService, loadMessagesService } from "../services/messageServices";
import { sendMessageDto } from "../dto/messageController/sendMessageDto";
import { getConversationDto } from "../dto/messageController/getConversationDto";
import { isAuthenticated } from "../guards/isAuthenticated";
import { getMessageDto } from "../dto/messageController/getMessageDto";
import { loadChatListDto } from "../dto/messageController/loadChatListDto";
import { upload } from "../utilities/multer";
import { dropboxUpload } from "../utilities/dropbox";


export const messageController = Router();
messageController


.post('/sendMessage', isAuthenticated, upload.single('file'), dropboxUpload, async (req: Request, res: Response): Promise<any> => {
    const response = await sendMessageService(req.body as sendMessageDto, (req.user as any).id) as number | object;
    return isFinite(response as number) ? res.sendStatus(response as number) : res.json(response);
})


.post('/getActiveClients', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await getActiveClientsService((req.user as any).role);
    return response.status !== 200 ? res.sendStatus(response.status) : res.status(200).json(response.result);
})


.post('/loadChatList', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadChatListServices((req.user as any).id, req.body as loadChatListDto);
    return response.status !== 200 ? res.sendStatus(response.status) : res.status(response.status).json(response.result);
})


.post('/loadMessages', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadMessagesService((req.user as any).id, req.body as getConversationDto);
    return response.status !== 200 ? res.sendStatus(response.status) : res.status(200).json(response.result);
})


.post('/loadMessage', isAuthenticated, async (req: Request, res: Response): Promise<any> => {
    const response = await loadMessageService(req.body as getMessageDto, (req.user as any).id);
    return response.status !== 200 ? res.sendStatus(response.status) : res.status(response.status).json(response.result);
})