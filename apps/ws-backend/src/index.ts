// import {WebSocketServer} from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import {JWT_SECRET} from "@repo/backend-common/config";
// const wss=new WebSocketServer({port:8080});

// wss.on("connection",function connection(ws,request){
//     const url=request.url;  //ws.localhost:8080?token=123123
//     // ["ws://localhost:8080","token=123123"] url.spilt('?') done that
//     if(!url){
//         return;
//     }
//     const queryParams=new URLSearchParams(url.split('?')[1])
//     const token=queryParams.get('token') || "";
//     const decoded=jwt.verify(token,JWT_SECRET);

//     // @ts-ignore
//     if(!decoded || !(decoded as JwtPayload).userId){
//         ws.close();
//         return;
//     }

//     ws.on('message',function message(data){
//         ws.send('pong')
//     })
// })


import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// Start WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
    const url = request.url;

    if (!url) {
        ws.close(4000, "Missing URL");
        return;
    }

    // Extract token from query string
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");

    if (!token) {
        ws.close(4001, "Missing token");
        return;
    }

    let decoded: string | JwtPayload;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("JWT verification failed:", err);
        ws.close(4002, "Invalid or expired token");
        return;
    }

    // Check if decoded token contains userId
    if (typeof decoded !== "object" || !decoded.userId) {
        ws.close(4003, "Invalid token payload");
        return;
    }

    // Optional: Log user info or attach to ws object
    console.log("User connected:", decoded.userId);

    // Handle incoming messages
    ws.on("message", (data) => {
        console.log("Received:", data.toString());
        ws.send("pong");
    });
});
