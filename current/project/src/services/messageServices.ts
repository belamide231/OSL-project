import { mysql } from "../app";
import { getConversationDTO } from "../dto/messageController/getConversationDTO";
import { insertMessageDTO } from "../dto/messageController/insertMessageDTO";


export const insertMessageService = async (data: insertMessageDTO): Promise<number> => {

    try {

        const sender = "timoy";

        await mysql.promise().query('CALL insert_message(?, ?, ?, ?, ?, ?)',
            [new Date(), data.contentText, data.contentFile, data.content, sender, data.receiver]
        );

        return 200;

    } catch(error) {

        return 400;
    }
}

export const getConversationsHeadsService = async (identifier: string) => {

    try {

        const conversationsHeads = await mysql.promise().query('CALL get_conversations_heads(?)', [identifier]);
        console.log(conversationsHeads);

        return 200;

    } catch(error) {

        return 400;
    }
}

export const getConversationService = async (identifier: string, data: getConversationDTO) => {

    try {

        const conversation = await mysql.promise().query('CALL get_conversation(?, ?)', [identifier, data.chatmateIdentifier]);

        return 200;

    } catch(error) {

        return 400;
    }
}