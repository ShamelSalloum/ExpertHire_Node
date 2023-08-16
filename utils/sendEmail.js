import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
  });
};

export default sendEmail;
