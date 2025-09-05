import {WebSocketServer} from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
const wss=new WebSocketServer({port:8080});

wss.on("connection",function connection(ws,request){
    const url=request.url;  //ws.localhost:8080?token=123123
    // ["ws://localhost:8080","token=123123"] url.spilt('?') done that
    if(!url){
        return;
    }
    const queryParams=new URLSearchParams(url.split('?')[1])
    const token=queryParams.get('token') || "";
    const decoded=jwt.verify(token,JWT_SECRET);

    // @ts-ignore
    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
    }

    ws.on('message',function message(data){
        ws.send('pong')
    })
})