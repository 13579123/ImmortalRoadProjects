import { Connection, Pool, PoolConnection } from "mysql";
import { TABLE_MYSQL_POOL } from "./TABLE_MYSQL_POOL";
import { fieldToClassName, formateTableName } from "./formateTableName";
import { MysqlTransection } from "./MysqlTransection";

async function getConnect(pool: Pool) {
  return new Promise<PoolConnection>((res , rej) => {
    pool.getConnection((err , connect) => {
      if (err) throw err
      res(connect)
    })
  })
}

async function query(connect: PoolConnection , sql: string , values: any[]) {
  return new Promise<any>(res => {
    connect.query(sql , values , (err , result) => {
      if (err) throw err
      res(result)
    })
  })
}

export type ConditionData<T> = {key: keyof T , value: any , relation?: "="|">"|"<"|"like"}|"and"|"or"|"("|")"|""

export type QueryOptions<T> = {
  // 要查询的字段
  selectFields?: (keyof T)[],
  // 查询条件
  conditions?: ConditionData<T>[],
  // 事务
  transection?: MysqlTransection,
  // 排序
  order?: {key: keyof T , type?: 'asc'|'desc'},
  // 锁类型
  lockType?: "S LOCK"|"X LOCK",
}

export type CreateOptions<T> = {
  // 事务
  transection?: MysqlTransection,
  // 锁类型
  lockType?: "S LOCK"|"X LOCK"
}

export type UpdateOptions<T> = {
  // 事务
  transection?: MysqlTransection,
  // 锁类型
  lockType?: "S LOCK"|"X LOCK"
}

export type DeleteOptions<T> = {
  // 事务
  transection?: MysqlTransection,
  // 锁类型
  lockType?: "S LOCK"|"X LOCK"
}

export type UpdateTableResult = {
  fieldCount?: number,
  affectedRows?: number,
  insertId?: number,
  serverStatus?: number,
  warningCount?: number,
  message: string,
  protocol41?: boolean,
  changedRows?: number
}

export class MysqlTableClass {

  public static getTransection() {
    return new MysqlTransection()
  }

  // 查询一个
  public static async queryOne<T>(option: QueryOptions<T> = {}): Promise<Partial<T>> {
    return (await this.query<T>(option))[0]
  }

  // 查询
  public static async query<T>(option: QueryOptions<T> = {}): Promise<Partial<T>[]> {
    const tableName = formateTableName(this.name)
    const pool = TABLE_MYSQL_POOL.get(tableName)
    if (!pool) {
      throw "Cannot get Pool from Class " + tableName
    }
    let connect: PoolConnection|null = null
    if (option.transection) 
      connect = option.transection.connect ? option.transection.connect : await option.transection.setConnect(await getConnect(pool))
    else
      connect = await getConnect(pool)
    let sql = 'select ' , values: any[] = []
    try {
      if (!option.selectFields) sql += "*"
      else option.selectFields.forEach((k , i) => i === 0 ? sql += (k as string) : sql += ',' + (k as string))
      sql += " from " + tableName
      if (option.conditions) {
        sql += " where"
        option.conditions.forEach(v => {
          if (typeof v === 'string') sql += " " + v
          else {
            sql += " " + formateTableName(v.key as any) + " " + (v.relation || "=") + " ?"
            values.push(v.value)
          }
        })
      }
      if (option.order) sql += ' order by ' + formateTableName(option.order.key as string) + ' ' + (option.order.type || '')
      if (option.lockType === 'S LOCK') sql += ' LOCK IN SHARE MODE'
      else if (option.lockType === 'X LOCK') sql += ' FOR UPDATE'
      const result = await query(connect , sql , values)
      result.forEach((v: any) => Object.keys(v).forEach((k) => v[fieldToClassName(k)] = v[k]))
      return result.map((d: any) => {
        const r = new this
        Object.keys(d).forEach(k => (r as any)[fieldToClassName(k)] = d[k])
        return r
      })
    } catch(e) {console.error("Select error sql: " + sql , e);throw e} finally {
      if (!option.transection?.connect)
        connect.release()
    }
  }

  // 创建字段
  public static async create<T>(data: Partial<T> , option: CreateOptions<T> = {}): Promise<UpdateTableResult> {
    const tableName = formateTableName(this.name)
    const pool = TABLE_MYSQL_POOL.get(tableName)
    if (!pool) {
      throw "Cannot get Pool from Class " + tableName
    }
    let connect: PoolConnection|null = null
    if (option.transection) 
      connect = option.transection.connect ? option.transection.connect : await option.transection.setConnect(await getConnect(pool))
    else
      connect = await getConnect(pool)
    let sql = 'INSERT IGNORE INTO ' + tableName , values: any[] = []
    try {
      sql += " ("
      Object.keys(data).forEach((k , i) => {
        if (i === 0) sql += formateTableName(k)
        else sql += "," + formateTableName(k)
      })
      sql += ")VALUES("
      Object.keys(data).forEach((k , i) => {
        if (i === 0) sql += "?"
        else sql += "," + "?"
        values.push((data as any)[k])
      })
      sql += ")"
      if (option.lockType === 'S LOCK') sql += ' LOCK IN SHARE MODE'
      else if (option.lockType === 'X LOCK') sql += ' FOR UPDATE'
      const result = await query(connect , sql , values)
      return result
    } catch(e) {console.error("Update error sql: " + sql , e);throw e} finally {
      if (!option.transection?.connect)
        connect.release()
    }
  }

  // 修改字段
  public static async update<T>(data: Partial<T> , conditions: ConditionData<T>[] = [] , option: UpdateOptions<T> = {}): Promise<UpdateTableResult> {
    const tableName = formateTableName(this.name)
    const pool = TABLE_MYSQL_POOL.get(tableName)
    if (!pool) { throw "Cannot get Pool from Class " + tableName }
    let connect: PoolConnection|null = null
    if (option.transection) 
      connect = option.transection.connect ? option.transection.connect : await option.transection.setConnect(await getConnect(pool))
    else {
      connect = await getConnect(pool)
    }
    let sql = 'UPDATE ' + tableName , values: any[] = []
    try {
      sql += " SET "
      Object.keys(data).forEach((k , i) => {
        if (i === 0) sql += formateTableName(k) + "=?"
        else sql += "," + formateTableName(k) + "=?"
        values.push((data as any)[k])
      })
      if (conditions && conditions.length > 0) {
        sql += " where"
        conditions.forEach(v => {
          if (typeof v === 'string') sql += " " + v
          else {
            sql += " " + formateTableName(v.key as any) + " " + (v.relation || "=") + " ?"
            values.push(v.value)
          }
        })
      }
      if (option.lockType === 'S LOCK') sql += ' LOCK IN SHARE MODE'
      else if (option.lockType === 'X LOCK') sql += ' FOR UPDATE'
      const result = await query(connect , sql , values)
      return result
    } catch (e) { console.error("Update error sql: " + sql , e);throw e } finally {
      if (!option.transection?.connect) connect.release()
    }
  }

  // 删除字段
  public static async delete<T>(conditions: ConditionData<T>[] = [] , option: DeleteOptions<T> = {}): Promise<UpdateTableResult> {
    const tableName = formateTableName(this.name)
    const pool = TABLE_MYSQL_POOL.get(tableName)
    if (!pool) {
      throw "Cannot get Pool from Class " + tableName
    }
    let connect: PoolConnection|null = null
    if (option.transection) 
      connect = option.transection.connect ? option.transection.connect : await option.transection.setConnect(await getConnect(pool))
    else
      connect = await getConnect(pool)
    let sql = 'DELETE FROM ' + tableName , values: any[] = []
    try {
      if (conditions && conditions.length > 0) {
        sql += " WHERE"
        conditions.forEach(v => {
          if (typeof v === 'string') sql += " " + v
          else {
            sql += " " + formateTableName(v.key as any) + " " + (v.relation || "=") + " ?"
            values.push(v.value)
          }
        })
      }
      if (option.lockType === 'S LOCK') sql += ' LOCK IN SHARE MODE'
      else if (option.lockType === 'X LOCK') sql += ' FOR UPDATE'
      const result = await query(connect , sql , values)
      return result
    } catch (e) { console.error("Update error sql: " + sql , e);throw e } finally {
      if (!option.transection?.connect)
        connect.release()
    }
  }

}