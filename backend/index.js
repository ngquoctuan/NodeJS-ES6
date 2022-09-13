/* eslint-disable indent */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/user.js";

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("CONNECTED TO MONGO DB"))
    .catch(e => console.log(e));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth", UserRoute);

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running on PORT " + process.env.PORT);
});

