import COS from "cos-js-sdk-v5";
import SparkMD5 from "spark-md5";
import { request } from "./request";

export async function uploadFileToCos(name, file) {
  return new Promise(async res => {
    const ext = file.name.split('.')[file.name.split('.').length - 1]
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = async function (e) {
      // 获取存储桶信息
      const requestRes = await request.get("/bucketData")
      if (!requestRes) return this.$message.warning("获取存储信息失败")
      spark.append(e.target.result);
      const md5 = spark.end(null)
      const cos = new COS({
        SecretId: requestRes.data.secrite_id,
        SecretKey: requestRes.data.secrite_key,
      })
      const result = await cos.putObject({
        Bucket: requestRes.data.bucket,
        Region: requestRes.data.region,
        Key: md5 + '.' + ext,
        Body: file, // 上传文件对象
      });
      res('https://' + result.Location)
    }
  })
}