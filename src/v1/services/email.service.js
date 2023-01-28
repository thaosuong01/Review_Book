const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");

function validateEmail(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await validate(email);

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        return resolve({
          errors: {
            message: "Địa chỉ email không hợp lệ",
          },
          status: 400,
        });
      }

      resolve({
        errors: null,
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function sendEmailVerifyAccount(dataSend, options) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    const response = await transporter.sendMail({
      from: `"Website review sách" <${process.env.EMAIL_APP_USERNAME}>`,
      to: dataSend.sendToEmail,
      subject: options.subject,
      html: options.handleHtmlLang,
    });

    if (response) {
      return {
        status: 201,
        errors: null,
        elements: dataSend.data,
      };
    }
  } catch (error) {
    return {
      status: 500,
      errors: error,
      elements: null,
    };
  }
}

module.exports = { validateEmail, sendEmailVerifyAccount };
