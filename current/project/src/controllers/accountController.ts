import { Router, Request, Response } from "express";
import { loginAccountDTO } from "../dto/accountController/loginAccount";
import { generateToken } from '../utilities/jwt';
import { createAccountDTO } from "../dto/accountController/createAccount";
import { createAccountService, inviteToSignupService } from "../services/accountServices";
import { isInvited } from "../guards/isInvited";
import { redis } from "../app";
import { isSignupValid } from "../guards/isSignupValid";
import { inviteToSignupDto } from "../dto/accountController/inviteToSignupDTO";


export const accountController = Router();
const credentials = ['ibcadmin', 'gisadmin', 'jetadmin'];
const users: any = {
    ibcadmin: 'IBC admin',
    gisadmin: 'Gis admin',
    jetadmin: 'Jet admin'
};

/* { "email": "belamidemills29@gmail.com", "role": "admin", "company": "ibc" } */
accountController.post('/invite', async (req: Request, res: Response): Promise<any> => {
    return res.sendStatus(await inviteToSignupService(req.body as inviteToSignupDto));
});
accountController.get('/invite', isInvited);

accountController.get('/sign-up', isSignupValid, (req: Request, res: Response): any => {    

    return res.status(200).send(`
        <h1>FILL-UP</h1>
        <br><br>
        <input type="text" placeholder="username" />
        <br>
        <input type="password" placeholder="password" />
        <br>
        <input type="password" placeholder="re-type password" />
        <br>
        <input type="button" value="submit">
    `);
});

accountController.post('/loginAccount', (req: Request, res: Response): any => {

    const account = req.body as loginAccountDTO;
    if (credentials.includes(account.username) && credentials.includes(account.password) && account.username === account.password) {

        const refreshToken = generateToken(0, users[account.username], 'admin', null);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict'
        });

        return res.status(200).json({ message: 'Login successful' });

    } else {

        return res.status(403).json({ message: 'Invalid credentials' });
    }
});

accountController.post('/logoutAccount', async (req: Request, res: Response): Promise<any> => {

    try {

        await redis.db1.del(req.sessionID);

        res.cookie('refreshToken', '', {
            expires: new Date(0)
        });    

    } catch {
        
        return res.sendStatus(500);
    }

    return res.status(200).json({ message: 'Cookie cleared, logged out successfully' });
    
});

accountController.post('/createAccount', async (req: Request, res: Response) => {
    const status = await createAccountService(req.body as createAccountDTO);
    res.sendStatus(status);
});

accountController.post('/deleteAccount', (req: Request, res: Response) => {

});