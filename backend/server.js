require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const express = require("express");
const app = express();

const testRoutes = require("./routes/test/index.js");
app.use("/test", testRoutes);


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

const requestTimeMiddleware = require("./middleware/request-time.js");
const rootRoutes = require("./routes/root");

app.use(requestTimeMiddleware);
app.use("/", rootRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// app.use((request, response, next) => {
//   next(createError(404));
// });
