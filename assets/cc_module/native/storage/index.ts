import { StorageDTO } from "./StorageDTO"

export function get<T>(key: string): T|null {
  return StorageDTO.parse(localStorage.getItem(key))
}

export function del(key: string) {
  localStorage.removeItem(key)
}

type SetOption = {
  time: number,
}

export function set(key: string , value: any , option: SetOption = {
  time: -1
}) {
  const storage = new StorageDTO
  storage.data = value
  storage.key = key
  storage.expired = (option.time === -1 ? -1 : option.time + Date.now())
  localStorage.setItem(key , StorageDTO.serialization(storage))
  return
}