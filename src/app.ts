import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { userRoutes } from "./modules/user/user.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express();
// parser
app.use(express.json());

// initializing DB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send(
    "A robust RESTful API for a vehicle rental management system built with Node.js, Express, TypeScript, and PostgreSQL."
  );
});

//auth routes
app.use("/api/v1/auth", authRoutes);

//users routes
app.use("/api/v1/users", userRoutes);

//vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

//booking routes
app.use("/api/v1/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;

