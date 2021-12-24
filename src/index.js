import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import profileRoute from "./routes/profile.js";
import authRoute from "./routes/auth/index.js";
import usersRoute from "./routes/users/index.js";

const main = async () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.redirect(process.env.CLIENT_DOMAIN);
  });

  app.use("/profile", profileRoute);
  app.use("/auth", authRoute);
  app.use("/users", usersRoute);

  await mongoose.connect(process.env.MONGODB_SRV, {
    dbName: process.env.DATABASE_NAME,
  });
  console.log("Connected to the Database");

  app.listen(process.env.PORT, () => {
    console.log(
      `App is listening at ${process.env.DOMAIN}:${process.env.PORT}`
    );
  });
};

main().catch((err) => {
  console.log(err);
});
