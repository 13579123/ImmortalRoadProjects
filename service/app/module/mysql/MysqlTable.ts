import { Pool } from "mysql";
import {FINAL_TABLE_STRUCT} from "./FINAL_TABLE_STRUCT";
import { TABLE_MYSQL_POOL } from "./TABLE_MYSQL_POOL";
import { formateTableName } from "./formateTableName";

type TableOption = {
  mysqlPool: Pool
}

// 定义mysql表
export const MysqlTable: (option: TableOption) => ClassDecorator = (option) => {
  return (target) => {
    const tableName = formateTableName(target.name)
    const fieldInfo = FINAL_TABLE_STRUCT.get(tableName)
    if (!fieldInfo) return console.warn("Cannot find Field info from table name " + tableName)
    let fieldSql = ``
    for (let i = 0; i < Object.keys(fieldInfo).length; i++) {
      const key = Object.keys(fieldInfo)[i]
      fieldSql += '`' + formateTableName(key) + '`'
      if (fieldInfo[key].size) fieldSql += ' ' + fieldInfo[key].type + `(${fieldInfo[key].size})`
      else fieldSql += ' ' + fieldInfo[key].type
      if (fieldInfo[key].isUnsigned) fieldSql += ' UNSIGNED'
      if (!fieldInfo[key].isNull) fieldSql += ' NOT NULL'
      if (fieldInfo[key].isPrimary) fieldSql += ' PRIMARY KEY'
      if (fieldInfo[key].isUnique) fieldSql += ' UNIQUE'
      if (fieldInfo[key].autoIncrement) fieldSql += ' AUTO_INCREMENT'
      else if (fieldInfo[key].default !== void 0) fieldSql += ` DEFAULT ${fieldInfo[key].default}`
      if (fieldInfo[key].comment) fieldSql += ' COMMENT \'' + fieldInfo[key].comment + '\''
      if (i + 1 < Object.keys(fieldInfo).length) fieldSql += ','
    }
    let sql = `create table if not exists ${tableName}(${fieldSql})ENGINE=InnoDB DEFAULT CHARSET=utf8;`
    TABLE_MYSQL_POOL.set(tableName , option.mysqlPool)
    option.mysqlPool.getConnection((err , connect) => {
      if (err) throw err
      // connect.query('SHOW COLUMNS FROM ' + tableName , (err , result) => {
      //   console.log(result)
      // })
      connect.query(sql , (err , result) => {
        if (err) {
          connect.release()
          throw err
        }
        console.log("Create table " + tableName + " successfull")
        connect.release()
      })
    })
    return
  }
}