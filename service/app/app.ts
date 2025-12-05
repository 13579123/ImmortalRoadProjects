import express from "express"
import path from "path";
import cors from 'cors'
import dotenv from "dotenv";
import { swagger } from "./module/swagger";
import { Api } from "./module/swagger/Api";
import apiRouter from "./router";

dotenv.config()

const app = express()

app.use(cors())

app.use("/public" , express.static(path.join(process.cwd() , 'public')))

app.use(express.urlencoded())

app.use(express.json())

app.use("/doc" , swagger.document())

app.use("/api" , apiRouter)

app.get("/bucketData" , Api({
    method: "GET", 
    url: "/bucketData", 
    comment: "获取存储桶信息 ",
  }) , (req , resp , next) => {
  resp.send({
    bucket: process.env.BUCKET_NAME , 
    region: process.env.Region , 
    secrite_id: process.env.SECRITE_ID ,
    secrite_key: process.env.SECRITE_KEY
  })
})

app.get("/version" , (req , resp , next) => {
  resp.send([1,0,0])
})

app.use( 
  Api({ method: "ANY" , url: "/404" , group: "404不存在接口" }) ,
  (req , resp , next) => { resp.status(404);resp.send("404 NOT FOUND") }
)

export default app