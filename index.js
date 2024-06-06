const express = require("express");
const cors = require("cors");
// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const stripe = require("stripe")(
  "sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS"
);

// Routes
const routes = require("./routes/index");
const path = require("path");

const dbConnect = require("./db/dbconnect");
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.post("/webhook", async (req, res) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      "whsec_67u1FD9VDA8UfgEHJh4xCsxNqdu6cjSV"
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).end();
  }
  switch (event.type) {
    case "invoice.payment_succeeded":
      const subscriptionId = event.data.object.subscription;
      console.log(`Payment succeeded for subscription ${subscriptionId}`);
      break;
    case "invoice.payment_failed":
      const failedSubscriptionId = event.data.object.subscription;
      console.log(`Payment failed for subscription ${failedSubscriptionId}`);
      break;
    default:
      return res.status(400).end();
  }

  res.status(200).end();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cookieParser());
app.use(express.json());

app.use("/", routes);
