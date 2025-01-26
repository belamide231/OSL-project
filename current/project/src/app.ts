import express, { urlencoded, json } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dontenv from 'dotenv';
import path from 'path';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

dontenv.config();

import { getMysqlConnection } from './configuration/mysql';
import { getRedisConnection } from './configuration/redis';
import { controller } from './controllers/controller';
import { connection } from './sockets/connection';
import { data } from './interfaces/websocket/data';

export const mysql = getMysqlConnection();
export const redis = new getRedisConnection();

const app = express();
const server = http.createServer(app);
export const io = new Server(server);
export const socketLocator: Record<string, number> = {};
export const clients: Record<string, data> = {};
export const admin: Record<string, data> = {};
export const account: Record<string, data> = {};
export const superUser: Record<string, data> = {};
export const user: Record<string, data> = {};

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ 
    extended: true 
}));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(session({ 
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'tae', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { 
        secure: false 
    } 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(controller);
app.use(express.static(path.join(__dirname, '../public/browser')));

io.on('connection', connection);

const port = process.env.SERVER_PORT;
server.listen(port, () => console.log(`http://localhost:${port}`));