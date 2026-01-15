import express from "express";
import path from "path";
import mongoose  from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB = process.env.MONGODB_URL


// db
mongoose.connect(MONGODB).then((e)=>console.log("MongoDB Connected")
)
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/user", UserRouter);

// server
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
