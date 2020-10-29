const nodemailer = require("nodemailer");
const pug = require('pug')
const htmlToText = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email,
      this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Abdelrahman Abbady <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'abdelrhmanmkting@gmail.com',
          pass: '3342581a'
        }
      })
    }
    
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async send(template, subject) {
    //1 - Render template with pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject
      })
    // 2 - Define Email Options
    const mailOptions = {
      from: this.form,
      to: this.to,
      subject,
      html,
      //text: options.message,
    };
   await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome' , `Welcome To Natours Family ${this.firstName}` )
  }

  async sendResetPassword() {
    await this.send('passwordReset' , 'Your password reset token (valid for 10 mins)')
  }
}





