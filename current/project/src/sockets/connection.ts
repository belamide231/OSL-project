import { socketLocator, clients, admin, account, superUser, user } from "../app";
import { Socket } from "socket.io";

interface joinData {
    identifier: number;
    role: string;
}

export const connection = (socket: Socket) => {

    socket.on('join', (data: joinData) => {

        socketLocator[socket.id] = data.identifier;

        if(!clients[data.identifier]) {
            clients[data.identifier] = { 
                id: data.identifier, 
                role: data.role, 
                connections: [socket.id] 
            }

        } else {

            const updatedConnection = clients[data.identifier].connections;
            updatedConnection.push(socket.id);

            clients[data.identifier] = { 
                id: data.identifier, 
                role: data.role, 
                connections: updatedConnection
            }
        }

        switch(data.role) {

            case 'admin':
                admin[data.identifier] = clients[data.identifier];
                break;

            case 'account':
                account[data.identifier] = clients[data.identifier];
                break;

            case 'superUser':
                superUser[data.identifier] = clients[data.identifier];
                break;

            case 'user':
                user[data.identifier] = clients[data.identifier];
                break;

            default: 
                break;
        }
    });
    
    
    socket.on('disconnect', () => {

        const identifier = socketLocator[socket.id];

        if(identifier) {

            delete socketLocator[socket.id]
            const index = clients[identifier].connections.indexOf(socket.id);
            const role = clients[identifier].role;
    
            clients[identifier].connections.splice(index, 1);

            if(clients[identifier].connections.length === 0) {
                delete clients[identifier];
            }

            switch(role) {

                case 'admin':
                    clients[identifier] ? admin[identifier] = clients[identifier] : delete admin[identifier];
                    break;
    
                case 'account':
                    clients[identifier] ? account[identifier] = clients[identifier] : delete account[identifier];
                    break;
    
                case 'superUser':
                    clients[identifier] ? superUser[identifier] = clients[identifier] : delete superUser[identifier];
                    break;
    
                case 'user':
                    clients[identifier] ? user[identifier] = clients[identifier] : delete user[identifier];
                    break;
    
                default:
                    break;
            }
        }        
    });
}
