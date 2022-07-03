const mailgun = require("mailgun-js");
const apiKey = process.env.MAILGUN_API_KEY;
const DOMAIN = "sandboxf4371192fe8d493192e3a00d06fc1bcc.mailgun.org";
const mg = mailgun({ apiKey, domain: DOMAIN });

const data = {
  //   from: "Excited User chasetcallahan@gmail.com",
  //   to: "chasetcallahan@gmail.com",
  //   subject: "Hello",
  //   text: "Testing some Mailgun awesomness!",
};
// mg.messages().send(data, function (error, body) {
//   console.log(body);
// });

const sendWelcomeEmail = ({ name, email }) => {
  //   mg.messages().send(
  //     {
  //       from: "chasetcallahan@gmail.com",
  //       to: email,
  //       subject: "Welcome to my application!",
  //       text: `Welcome to the app ${name}`,
  //     },
  //     (error, body) => {
  //       console.log(body);
  //     }
  //   );
};

const sendCancellationEmail = ({ name, email }) => {
  //   mg.messages().send(
  //     {
  //       from: "chasetcallahan@gmail.com",
  //       to: email,
  //       subject: "Sorry We lost You!",
  //       text: `Anything that we could have done to keep you ${name}?`,
  //     },
  //     (error, body) => {
  //       console.log(body);
  //     }
  //   );
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
