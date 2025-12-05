import { PoolConnection } from "mysql";

export class MysqlTransection {

  public connect: PoolConnection|null = null

  public constructor () {
  }

  public async setConnect(connect: PoolConnection) {
    await new Promise(res => {
      this.connect = connect
      this.connect.beginTransaction(err => {
        if (err) {
          console.error("Start transection Failed!!!")
          throw err
        }
        res(0)
      })
    })
    return connect
  }

  private hasRelease: boolean = false

  public release() {
    if (this.hasRelease || !this.connect) return
    this.hasRelease = true
    this.connect?.release()
  }

  public async rollback() {
    if (this.hasRelease || !this.connect) return
    await new Promise(res => {
      this.connect?.rollback(err => {
        if (err) {
          console.error("rollback Failed!!!")
          throw err
        }
        res(0)
      })
    })
    await this.commit()
  }

  public async commit() {
    if (this.hasRelease || !this.connect) return
    await new Promise(res => {
      this.connect?.commit(err => {
        if (err) {
          console.error("Commit Failed!!!")
          throw err
        }
        res(0)
      })
    })
    this.release()
  }

}
