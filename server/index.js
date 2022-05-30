const dotenv = require("dotenv");
dotenv.config({ path: ".server/.env" });
const path = require("path");
const cors = require("cors");
const express = require("express");
const routes = require("./routes/routes");
const passportSetup = require("./config/passportSetup");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const profileRoutes = require("./routes/profile-routes");
const authRoutes = require("./routes/auth-routes");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB Error -> ", err));

const app = express();

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    maxAge: 24 * 60 * 60 * 1000,
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(express.json());
app.use(cors());

//set up routes
app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
