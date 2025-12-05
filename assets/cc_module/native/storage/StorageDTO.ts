import { decode, encrypt } from "./encrypt"

export class StorageDTO {

  public data: any

  public key: string

  public expired: number

  public static parse<T>(m: string): T | null {
    try {
      const data: StorageDTO = JSON.parse(decode(m))
      if (data.expired && (data.expired === -1 || data.expired > Date.now())) {
        return data.data
      }
    } catch { }
    return null
  }

  public static serialization(storage: StorageDTO): string {
    try {
      return encrypt(JSON.stringify(storage))
    } catch { }
    return ""
  }

}