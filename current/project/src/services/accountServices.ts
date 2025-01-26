import { createAccountDTO } from "../dto/accountController/createAccount";
import { inviteToSignupDto } from "../dto/accountController/inviteToSignupDTO";
import { mysql, redis } from "../app";
import { generateInvitationToken } from "../utilities/jwt";
import { nodeMailer } from "../utilities/nodemailer";

export const createAccountService = async (data: createAccountDTO) => {

    try {

        await mysql.promise().query(" ", [data.username, data.password]);
        return 200;

    } catch (error) {

        console.error(error);
        return 500;
    }
}

export const inviteToSignupService = async (data: inviteToSignupDto): Promise<number> => {

    const invitationKey = generateInvitationToken(data.email, data.company, data.role);
    const url = `http://localhost:3000/invite?invitation=${invitationKey}`;

    try {

        await redis.db2.del(data.email);
        const sent = await nodeMailer(data.email, url);

        if(!sent) 
            return 403;
        
    } catch {

        return 400;
    } 

    return 200;
}