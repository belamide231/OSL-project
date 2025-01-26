import { Request, Response } from "express";

import { verifyInvitationToken } from "../utilities/jwt";
import { redis } from "../app";

export const isInvited = async (req: Request, res: Response): Promise<any> => {

    const invitation = req.query['invitation'] as string;
    if(!invitation)
        return res.sendStatus(401);

    const decoded = verifyInvitationToken(invitation);
    if(!decoded['token']) 
        return res.sendStatus(401);

    const payload = decoded['payload'] as any;
    const redisData = await redis.db2.get(payload.email);

    if(redisData === null) {

        const data = {
            role: payload.email,
            email: payload.email,
            company: payload.company
        }

        const sid = req.sessionID;

        try {

            await redis.db2.set(payload.email, JSON.stringify(data), { EX: 60 * 60 });
            await redis.db3.set(sid, payload.email, { EX: 60 * 60 });

        } catch {

            return res.sendStatus(500);
        }

    } 

    return res.redirect('/sign-up');
}