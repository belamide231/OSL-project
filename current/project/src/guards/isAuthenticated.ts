import { Request, Response, NextFunction } from "express";

import { generateToken, verifyToken } from "../utilities/jwt";
import { redis } from "../app";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    const sessionData = await redis.db1.get(req.sessionID);
    if(sessionData === null) {

        if(!req.cookies['refreshToken'])  {

            return res.redirect('/login');
        }                 
        
        const decoded = verifyToken(req.cookies['refreshToken']);

        if(!decoded.token) {

            res.cookie('refreshToken', '', {
                maxAge: 0
            });

            return res.redirect('/login');
        }

        const data = decoded.payload as any;
        const refreshToken = generateToken(data.id, data.name, data.role, data.picture);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        const sessionId = req.sessionID;
        const object = JSON.stringify(decoded['payload']);

        try {

            await redis.db1.set(sessionId, object, { EX: 60 * 60 });

        } catch {

            return res.status(500).redirect('/login');
        }            
    }

    next();
}