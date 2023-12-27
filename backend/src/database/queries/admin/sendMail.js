var nodemailer = require("nodemailer");

async function sendMail(req, res) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "comp47207@pet.ac.il",
      pass: "207324229",
    },
  });
console.log(req.body);
  var mailOptions = {
    from: "comp47207@pet.ac.il",
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return res.json({status:"good"})
    }
  });
}
module.exports = sendMail;
