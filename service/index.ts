import app from "./app/app";
import {DateUtil} from "./app/util/date";

const date = new Date()

app.listen(parseInt(process.env.SERVER_PORT as string) , () => {
  console.log(`This worker started success [${DateUtil.getFormatDate(date , 'YYYY:MM:DD hh:mm:ss')}] listen port : ${
    process.env.SERVER_PORT
  }`)
})