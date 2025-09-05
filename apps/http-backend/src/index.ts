import express from "express"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js"
import { JWT_SECRET } from "@repo/backend-common/config"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/schema";
import {prismaClient} from "@repo/db/index"
const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post("/signin", async (req, res) => {
    const data=SigninSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    const userId:string = "12";
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
    const data=CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    res.json({
        roomId: 123
    })
})

app.listen(3001);