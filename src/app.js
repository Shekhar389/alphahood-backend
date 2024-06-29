import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//routes import
import { contactRouter } from "./routes/contact.route.js"

import { errorMiddleware } from "./middlewares/error.middleware.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (_req, res) => {
    return res.status(200).json({ status: "running"});
});

//routes declaration
app.use("/", contactRouter);

// Error handling middleware
app.use(errorMiddleware);

export { app }