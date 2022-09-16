require("dotenv").config();
const express = require("express");
const DbConnect = require("./database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./routes/route");
const app = express();
const Port = process.env.PORT || 5000;
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use("/storage", express.static("storage"));
app.use(cookieParser());
DbConnect();
app.use(express.json({ limit: "8mb" }));

app.use(router);

app.listen(Port, () => {
  console.log("app run in ", Port);
});
