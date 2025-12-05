export function getSuccess<T>(code: number , message: string , data?: T) {
  return {
    code ,
    status: true,
    message ,
    data: data || null
  }
}

export function getFail<T>(code: number , message: string , data?: T) {
  return {
    code ,
    message ,
    status: false,
    data: data || null
  }
}