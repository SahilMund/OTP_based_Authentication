const nodeMailer = require("../config/nodeMailer");

exports.sendVerificationOTP = async ({ user, otp, res }) => {
  // Defining template that will be used for sending mails
  let htmlString = nodeMailer.renderTemplate({ user, otp }, "/otp_mail.ejs");

  nodeMailer.transporter.sendMail(
    {
      from: process.env.TRANSPORTER_USER_EMAIL,
      to: user.email,
      subject: "Account Verification - OTP || " + user.name,
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        res
          .status(500)
          .json({
            success: false,
            message: "Failed to send OTP." + err.message,
          });
      }

      res
        .status(200)
        .json({
          success: true,
          message: `OTP sent successfully to your email -  ${user.email}`,
        });
    }
  );
};
