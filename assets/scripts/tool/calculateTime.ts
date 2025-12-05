export default {
  // 计算年限
  getCultivateYear(now: number , start: number) {
    const time = now - start
    return Math.ceil(time / 864 / 1000) // 一天100年
  }
}