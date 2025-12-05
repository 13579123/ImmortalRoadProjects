import { Router } from "express";
import otherRouter from "./other";
import roleRouter from "./role";
import accountRouter from "./account";
import packRouter from "./pack";
import mapRouter from './map'
import adminRouter from './admin'
import sectRouter from './sect'
import folkPrescriptionRouter from './folkprescription'
import { filterIpByTime } from "../module/filter/filterIpByTime";

const apiRouter = Router()

apiRouter.use("/other" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , otherRouter)

apiRouter.use("/account" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , accountRouter)

apiRouter.use("/role" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , roleRouter)

apiRouter.use("/pack" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , packRouter)

apiRouter.use("/map" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , mapRouter)

apiRouter.use("/sect" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , sectRouter)

apiRouter.use("/folkPrescription" , filterIpByTime( { flashTime: 6 , requestCount: 20 } ) , folkPrescriptionRouter)

apiRouter.use("/admin" , adminRouter)

export default apiRouter