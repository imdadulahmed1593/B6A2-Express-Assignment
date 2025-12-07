import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

// POST /api/v1/bookings - Create a new booking (Customer or Admin)
router.post("/", auth("customer", "admin"), bookingController.createBooking);

// GET /api/v1/bookings - Get all bookings (role-based)
router.get("/", auth("customer", "admin"), bookingController.getAllBookings);

// PUT /api/v1/bookings/:bookingId - Update booking status (role-based)
router.put(
  "/:bookingId",
  auth("customer", "admin"),
  bookingController.updateBooking
);

export const bookingRoutes = router;
