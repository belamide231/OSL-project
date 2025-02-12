import { io, socketClients } from "../app";
import { deliveredChatService, seenChatService } from "../services/messageServices";


export const receiveMessageSocket = async (socket: any, chatmateId: number): Promise<void> => {
    const result = await seenChatService(socket.user.id, chatmateId) as any;
    if(isFinite(result)) return;

    result['chatmate_id'] = socket.user.id;
    io.to(socketClients.clientConnections[chatmateId]).emit('seen message', result);

    result['chatmate_id'] = chatmateId;
    io.to(socketClients.clientConnections[socket.user.id]).emit('seen message', result);
}


export const messageDelivered = async (socket: any, chatmatesId: number[]): Promise<void> => {
    const result = await deliveredChatService(socket.user.id, chatmatesId) as any;
    if(isFinite(result)) return;

    let connections: string[] = [];
    chatmatesId.forEach((x) => connections = connections.concat(socketClients.clientConnections[x]));
    
    if(connections.length !== 0)
        io.to(connections).emit('message delivered', { chatmateId: socket.user.id, stamp: result.stamp });
}