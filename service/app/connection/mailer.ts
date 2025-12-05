import * as nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  secure: true,
  auth: {
      user: process.env.EMAIL_ACCOUNT || "",
      pass: process.env.EMAIL_PASS || "" // mtp 验证码 这个有了才可以发送邮件，可以qq邮箱去查看自己的码
  }
})


export async function sendMailer(mail: string , subject: string , content: string) {
  // 邮件信息
  let mailObj = {
      from: process.env.EMAIL_ACCOUNT || "", // sender address
      to: mail, // 接收者邮箱 可以是多个 以,号隔开
      subject: subject, // Subject line
      // 发送text或者html格式
      html: content
  }
  return new Promise((res, rej) => {
      // 发送邮件
      transporter.sendMail(mailObj, (err, data) => {
          if (err) {
              console.log(err)
              rej(err)
          } else res(null)
      })
  })
}