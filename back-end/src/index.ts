import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
//Routes
import usersRouter from "./routes/users.routes.js";
import itemsRouter from "./routes/items.routes.js";
import reviewsRouter from "./routes/reviews.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";

const app = express();
const port = Number(process.env.PORT) || 30170;

// Middleware
app.use(cors({
  origin:"http://88.200.63.148:30171", //frontend address
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const frontendPath =path.join(process.cwd(), "frontend-build");
app.use(express.static(frontendPath));

// Test route
app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

//Account and Profile Management
app.use("/users", usersRouter);
app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);
//Application routes
app.use("/items",itemsRouter);
app.use("/reviews",reviewsRouter);
app.use("/wishlist",wishlistRouter);

//Error Handler if any route crashes
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