const OtpGenerator = require("otp-generator");
const multer = require("multer");
const fs = require("fs");

function typeOfObjectId(value) {
  if (!value) return null;

  if (value.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  }

  return false;
}

function handleHtmlLang(dataSend) {
  return `
  <h1>Xác nhận tài khoản</h1>
  <p>Xin chào. ${dataSend.sendToEmail}</p>
  <p>Bạn nhận được email này vì đã đăng ký trên website review của chúng tôi</p>
  <p style="color: red">Nếu những thông tin trên là chính xác. Vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục xác thực tài khoản</>
  <div><a href=${dataSend.urlVerify} target="_blank"><strong>Link xác nhận</strong></a></div><br>
  <div><strong><i>Xin chân thành cảm ơn!</i></strong></div>
  `;
}

function handleHtmlLangEmailForgotPassword(dataSend) {
  return `
  <h1>Thay đổi mật khẩu</h1>
  <p>Xin chào. ${dataSend.sendToEmail}</p>
  <p>Bạn nhận được email này vì đã click vào quên mật khẩu trên website review của chúng tôi</p>
  <p style="color: red">Nếu những thông tin trên là chính xác. Vui lòng click vào link bên dưới để xác nhận và hoàn tất thủ tục thay đổi mật khẩu</>
  <div><a href=${dataSend.urlVerify} target="_blank"><strong>Link thay đổi</strong></a></div><br>
  <div><strong><i>Xin chân thành cảm ơn!</i></strong></div>
  `;
}

function createOTP() {
  const OTP = OtpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return OTP;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirUpload = "src/assets/upload/";

    if (!fs.existsSync(dirUpload)) {
      fs.mkdirSync(dirUpload, { recursive: true });
    }

    cb(null, dirUpload);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".");
    const newExt = ext[ext.length - 1];
    cb(null, `${Date.now()}.${newExt}`);
  },
});

module.exports = {
  typeOfObjectId,
  handleHtmlLang,
  createOTP,
  handleHtmlLangEmailForgotPassword,
  storage,
};
