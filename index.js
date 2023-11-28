const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// Routes
const authRoutes = require("./routes/AuthRoutes");

const dbConnect = require("./db/dbconnect");
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: [`http://localhost:${PORT}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   next();
// });

app.use(cookieParser());
app.use(express.json());

app.use("/api", authRoutes);
