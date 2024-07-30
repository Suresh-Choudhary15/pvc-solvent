const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
