require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


const express = require("express");
const app = express();


// Sessions
const session = require('express-session');
const postgreSession = require('connect-pg-simple')(session);
app.use(session({
  store: new postgreSession({
    conObject: {
      connectionString: process.env.DATABASE_URL, // PostgreSQL database configuration from the .env file
    },
  }),
  secret: 'mysteriousUnoKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));


const testRoutes = require("./routes/test/index.js");
app.use("/test", testRoutes);


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

const requestTimeMiddleware = require("./middleware/request-time.js");
const rootRoutes = require("./routes/root");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");

app.use(requestTimeMiddleware);
app.use("/", rootRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// app.use((request, response, next) => {
//   next(createError(404));
// });
