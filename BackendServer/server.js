const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const loginRoute = require("./routes/loginRoute.js");
const employeeRoute = require("./routes/employeeRoute.js");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.status(200).send("Server is running on the port...", port);
});
app.use("/api", loginRoute);
app.use("/employee", employeeRoute);
app.listen(port, () => {
    console.log("Server is running on the port...", port);
    connectDB();
})