import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cors from "cors";
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api", router)

const PORT = process.env.PORT || 3001

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server Started")
    })
}).catch((error) => {
    console.log("Failed to  Connect DB And Server ")
})
