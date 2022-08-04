import express from "express";
import "dotenv/config";

const app = express();
const { PORT = 3000 } = process.env;

import homeRouter from "./api/routes/home.js";
app.use("/api", homeRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
