const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const yup = require("yup");

const validEmail = yup
  .string()
  .min(3)
  .max(255)
  .email("Please provide a valid email");

mongoose.connect(
  "mongodb://localhost/cwb_email_list",
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

app.use(
  cors({
    origin: "www.coworkingbuddies.com"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  if (req.body.email === "") return res.send("Please provide an email");

  try {
    await validEmail.validate(req.body.email, { abortEarly: false });
  } catch (error) {
    return res.send(error.message);
  }

  await Email.create({ email: req.body.email });

  return res.send("You will be notified!");
});

app.listen(6969, () => {
  console.log("ITS ONLINE");
});
