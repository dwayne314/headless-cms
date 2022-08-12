import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import configurePassport from "./config/passport";
import "dotenv/config";

// Config
const { DB_URI, PORT = 3000, APP_SECRET } = process.env;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB Setup
mongoose.connect(DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Start DB Server
mongoose.connection.on("error", (err) => console.log(err));
mongoose.connection.once("open", () => console.log("DB connected"));

// Session Setup
app.use(
  session({
    secret: APP_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: DB_URI, collectionName: "sessions" }),
    cookie: {
      maxAge: 1000 * 30,
    },
  })
);

// Auth Setup
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Route Setup
import homeRouter from "./api/routes/home.js";
import authRouter from "./api/routes/auth.js";
app.use("/api", homeRouter);
app.use("/api/auth", authRouter);

// Start App Server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
