const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create axios instance
const listID = process.env.LIST_ID;

const instance = axios.create({
  baseURL: "https://api.sendfox.com",
  timeout: 10000,
  headers: { Authorization: `Bearer ${process.env.SENDFOX_TOKEN}` },
});

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/me", async (req, res) => {
  try {
    const response = await instance.get("/me");
    console.log("Success!");
    console.log(response.data);
    res.end();
  } catch (error) {
    console.log("Failed!");
    console.log(error.message);
    res.end();
  }
});

app.get("/api/newsletter", async (req, res) => {
  try {
    const response = await instance.get("/lists");
    console.log("Success");
    console.log(response.data);
    res.json({ data: response.data });
  } catch (error) {
    console.log("Failed!");
    console.log(error);
    res.json({ data: error.message });
  }
});

app.post("/api/newsletter", cors(corsOptions), async (req, res) => {
  const { first_name, email } = req.body;

  const response = await instance.post(
    `/contacts?email=${email}&first_name=${first_name}&lists[]=${listID}`
  );
  try {
    res.json({ data: response.data });
  } catch (error) {
    res.json({ data: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
