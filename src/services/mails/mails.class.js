/* eslint-disable no-unused-vars */
const nodemailer = require('nodemailer')

exports.Mails = class Mails{
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
          user: this.app.get("mailer.email"),
          pass: this.app.get("mailer.pass"),
        }
      }
    );
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {

    return this.transporter.sendMail(data, function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log("email sent: " + info.response)
      }
    })
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
