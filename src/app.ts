import express from "express";
import cors from "cors";
import helmet from "helmet";

import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "Chat backend API is running",
    });
});

app.use("/chat", chatRoutes);
app.use("/user", userRoutes);

export default app;