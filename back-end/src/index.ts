import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Routes
import usersRouter from "./routes/users.routes.js";


const app = express();

const port = Number(process.env.PORT) || 30170;

// Middleware
app.use(cors({
  origin:"http://88.200.63.148:30171", // frontend address
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Test route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Majhna Elita API running",
    status: "OK"
  });
});


// API Routes

// 1. Account and Profile Management
app.use("/users", usersRouter);



// Error Handler
app.use(
  (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});