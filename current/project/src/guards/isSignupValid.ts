import { Request, Response, NextFunction } from "express";
import { redis } from "../app";

export const isSignupValid = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const email = await redis.db3.get(req.sessionID);
    if(email === null)  
        return res.sendStatus(401);

    const data = await redis.db2.get(email);
    if(data === null)
        return res.sendStatus(401);

    next();
}