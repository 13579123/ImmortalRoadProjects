// 同步 游戏 前端 服务器 三端的数据库类型文件


const fs = require("fs")
const path = require("path")

const databaseDirList = fs.readdirSync(path.join(__dirname , 'RestService' , 'app' , 'database'))

databaseDirList.forEach((file) => {
  const tsFileSource = fs.readFileSync(path.join(__dirname , 'RestService' , 'app' , 'database' , file))
  const source = `
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

` + '@MysqlTable' + tsFileSource.toString().split('@MysqlTable')[1]
  fs.writeFileSync(path.join(__dirname , 'ImmortalRoad' , 'assets' , 'scripts' , 'database' , file) , source)
})

console.log("同步成功")