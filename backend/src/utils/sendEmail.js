import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"ALaura Haven Support" <support@ALaura.com>',
    to: options.email,
    subject: options.subject,
    html: options.html, // Dùng HTML để giao diện mail đẹp hơn
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;