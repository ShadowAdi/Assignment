import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ Explicitly define CORS options
const corsOptions = {
    origin: "https://assignment-client-six.vercel.app", // Allow your frontend domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server Started");
    });
}).catch((error) => {
    console.log("Failed to Connect DB And Server");
});
