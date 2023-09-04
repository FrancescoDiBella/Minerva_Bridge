/* eslint-disable no-unused-vars */
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.Mails = class Mails {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    /*this.transporter = nodemailer.createTransport({
        host: this.app.get("mailer").host,
        port: this.app.get("mailer").port,
        secure: false,
        auth:{
          user: this.app.get("mailer").email,
          pass: this.app.get("mailer").pass,
        }
      }
    );*/
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const email_to = data.to;
    const email_from = data.from;
    /*

    */
    const token = await this.createToken(email_to);
    const url = this.app.get("verifierURL") + `token=${token}`;

    const message = {
      from: email_from,
      to: email_to,
      subject: "MINERVA | Conferma email",
      text: "",
      html: `<h1> Gentile utente, conferma la tua mail tramite questo link: </h1> <br> <button href="${url}">Conferma la tua mail</button>`,
    };

    return this.transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent: " + info.response);
      }
    });
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
  async createToken(email) {
    const token = jwt.sign({ email }, this.app.get("authentication").secret, {
      expiresIn: "1h",
    });
    return token;
  }
};
