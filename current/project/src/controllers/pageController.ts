import { Router, Request, Response } from "express";
import path from 'path';

import { isAuthenticated } from "../guards/isAuthenticated";
import { hasToken } from "../guards/hasToken";

export const pageController = Router();

pageController.get('/login', hasToken, (req: Request, res: Response): void => {
    return res.status(200).sendFile(path.join(__dirname, '../../public/browser/index.html'));
});

pageController.get('/socketio', isAuthenticated, (req: Request, res: Response): any => {
    return res.sendFile(path.join(__dirname, '../test/test.html'));
});

pageController.get(['/', 'users', 'notification', 'settings', 'profile'], isAuthenticated, (req: Request, res: Response): any => {
    return res.status(200).sendFile(path.join(__dirname, '../../public/browser/index.html'));
});