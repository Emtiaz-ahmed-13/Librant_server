import cookieParser from "cookie-parser";
import express, { Application } from "express";
import router from "./app/Routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();
app.use(express.json());
app.use(cookieParser());

import cors from "cors";
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://librant-client.vercel.app",
      "https://librant-client-git-main-emtiazahmed.vercel.app",
      "https://librant-client-emtiazahmed.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("Welcome from Librant Book Store");
});

app.use(globalErrorHandler);
export const App = app;
