import { io, socketClients } from "../app";
import { deliveredChatService, seenChatService } from "../services/messageServices";


export const seenChat = async (socket: any, data: any): Promise<void> => {
    const result = await seenChatService(socket.user.id, data.chatmateId) as any;
    if(isFinite(result)) return;

    result['notify'] = data.notify;
    result['chatmate_id'] = socket.user.id;
    io.to(socketClients.clientConnections[data.chatmateId]).emit('seen message', result);

    result['chatmate_id'] = data.chatmateId;
    io.to(socketClients.clientConnections[socket.user.id]).emit('seen message', result);
}


export const messageDelivered = async (socket: any, chatmatesId: number[]): Promise<void> => {
    const result = await deliveredChatService(socket.user.id, chatmatesId) as any;
    if(isFinite(result)) return;

    let connections: string[] = [];
    chatmatesId.forEach((x) => connections = connections.concat(socketClients.clientConnections[x]));
    
    connections.length !== 0 && io.to(connections).emit('message delivered', { chatmateId: socket.user.id, stamp: result.stamp });
}


export const typingMessage = async (socket: any, chatmateId: number): Promise<void> => {
    
    io.to(socketClients.clientConnections[chatmateId]).emit("typing message", socket.user.id);
}


export const blankMessage = async (socket: any, chatmateId: number): Promise<void> => {

    io.to(socketClients.clientConnections[chatmateId]).emit("blank message", socket.user.id);
}