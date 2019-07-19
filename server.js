const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const yup = require("yup");
const dotenv = require("dotenv");

dotenv.config();

const corsOptions = {
  origin: "*"
  // allowedHeaders: ["Content-Type", "Authorization"]
};

const validEmail = yup
  .string()
  .min(3)
  .max(255)
  .email("Please provide a valid email");

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true
  },
  err => {
    if (err) console.log("WE FUCKED UP");

    console.log("we are connected");
  }
);

const emailSchema = new mongoose.Schema({ email: String });
const Email = mongoose.model("Email", emailSchema);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// app.get("/email_list", async (req, res) => {
//   try {
//     const emails = await Email.find();
//     console.log("ALL EMAILS", emails);
//   } catch (error) {
//     console.log("WE MESSED UP WHILE GETTING ALL EMAILS");
//   }
//   // var collection = db.get('usercollection');
//   // collection.find({},{},function(e,docs){
//   //     res.render('userlist', {
//   //         "userlist" : docs
//   //     });
//   // });
// });

app.post("/email_received", async (req, res) => {
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "https://www.coworkingbuddies.com"
  // );
  if (req.body.email === "") return res.send("Please provide an email");

  try {
    await validEmail.validate(req.body.email, { abortEarly: false });
  } catch (error) {
    return res.send(error.message);
  }

  await Email.create({ email: req.body.email });

  return res.send("You will be notified!");
});

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => {
  console.log("ITS ONLINE");
});
