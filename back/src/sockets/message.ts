import { io, socketClients } from "../app";
import { socketUser } from "../interface/socketUser";
import { deliveredChatService, seenChatService } from "../services/messageServices";


export const seenChat = async (user: socketUser, data: any): Promise<void> => {
    const result = await seenChatService(user.id, data.chatmateId) as any;
    if(isFinite(result)) return;

    result['notify'] = data.notify;
    result['chatmate_id'] = user.id;
    io.to(socketClients.clientConnections[data.chatmateId]).emit('seen message', result);

    result['chatmate_id'] = data.chatmateId;
    io.to(socketClients.clientConnections[user.id]).emit('seen message', result);
}


export const messageDelivered = async (user: socketUser, chatmatesId: number[]): Promise<void> => {
    const result = await deliveredChatService(user.id, chatmatesId) as any;
    if(isFinite(result)) return;

    let connections: string[] = [];
    chatmatesId.forEach((x) => connections = connections.concat(socketClients.clientConnections[x]));
    
    connections.length !== 0 && io.to(connections).emit('message delivered', { chatmateId: user.id, stamp: result.stamp });
}


export const typingMessage = async (user: socketUser, chatmateId: number): Promise<void> => {

    io.to(socketClients.clientConnections[chatmateId]).emit("typing message", user.id);
}


export const blankMessage = async (user: socketUser, chatmateId: number): Promise<void> => {

    io.to(socketClients.clientConnections[chatmateId]).emit("blank message", user.id);
}