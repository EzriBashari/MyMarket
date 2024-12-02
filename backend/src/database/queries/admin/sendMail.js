const nodemailer = require("nodemailer");

async function sendMail(req, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "comp47207@pet.ac.il",
      pass: "207324229", // Use environment variable for security
    },
  });

  console.log(req.body);

  const mailOptions = {
    from: "comp47207@pet.ac.il",
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return res.json({ status: "good" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}

module.exports = sendMail;
