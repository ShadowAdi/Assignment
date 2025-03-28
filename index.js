import express from "express";
import router from "./routes/router.js";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ Explicitly allow frontend domain & support credentials
const corsOptions = {
    origin: "https://assignment-client-six.vercel.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3001;

// ✅ Always connect to DB before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log("Failed to connect DB and server:", error);
});
