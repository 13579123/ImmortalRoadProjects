import {FieldType, FINAL_TABLE_STRUCT} from "./FINAL_TABLE_STRUCT";
import { formateTableName } from "./formateTableName";

// 定义mysql表
export const MysqlField: (option: FieldType) => PropertyDecorator = (option) => {
  return (target, propertyKey: string|symbol) => {
    console.log('MysqlField', target, propertyKey, option)
    const tableName = formateTableName(target.constructor.name)
    let tableInfo = FINAL_TABLE_STRUCT.get(tableName)
    if (!tableInfo) FINAL_TABLE_STRUCT.set(tableName , tableInfo = {})
    tableInfo[propertyKey as string] = option
  }
}