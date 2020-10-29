const dotenv = require("dotenv");
process.on("uncaughtExecptions", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASS
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfuly ");
  });

const server = app.listen(8000, () => {
  console.log(`App is listening to port 8000`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
