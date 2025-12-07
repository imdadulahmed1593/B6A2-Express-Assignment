import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  // Calculate total price
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = days * vehicle.daily_rent_price;

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        "active",
      ]
    );

    // Update vehicle availability status
    await client.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
      ["booked", vehicle_id]
    );

    await client.query("COMMIT");

    // Get vehicle details for response
    const vehicleDetails = await pool.query(
      `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id=$1`,
      [vehicle_id]
    );

    return {
      ...bookingResult.rows[0],
      vehicle: {
        vehicle_name: vehicleDetails.rows[0].vehicle_name,
        daily_rent_price: vehicleDetails.rows[0].daily_rent_price,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllBookings = async (userRole: string, userId?: number) => {
  let query = `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'name', u.name,
        'email', u.email
      ) as customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) as vehicle
    FROM bookings b
    LEFT JOIN users u ON b.customer_id = u.id
    LEFT JOIN vehicles v ON b.vehicle_id = v.id
  `;

  let params: any[] = [];

  // If customer, only show their own bookings
  if (userRole === "customer" && userId) {
    query += ` WHERE b.customer_id = $1`;
    params.push(userId);
  }

  query += ` ORDER BY b.created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

const updateBooking = async (
  bookingId: number,
  status: string,
  userRole: string,
  userId?: number
) => {
  // Get current booking details
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  // Business rules validation
  if (userRole === "customer") {
    // Customer can only cancel their own booking
    if (booking.customer_id !== userId) {
      throw new Error("You can only cancel your own bookings");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
    if (booking.status !== "active") {
      throw new Error("Only active bookings can be cancelled");
    }
  }

  if (userRole === "admin") {
    // Admin can mark as returned
    if (status === "returned" && booking.status !== "active") {
      throw new Error("Only active bookings can be marked as returned");
    }
  }

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update booking status
    const updateResult = await client.query(
      `UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, bookingId]
    );

    // If booking is cancelled or returned, update vehicle availability
    if (status === "cancelled" || status === "returned") {
      await client.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
        ["available", booking.vehicle_id]
      );
    }

    await client.query("COMMIT");

    // Get vehicle details for response
    const vehicleDetails = await pool.query(
      `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      ...updateResult.rows[0],
      vehicle: {
        vehicle_name: vehicleDetails.rows[0].vehicle_name,
        daily_rent_price: vehicleDetails.rows[0].daily_rent_price,
        availability_status: vehicleDetails.rows[0].availability_status,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBooking,
};
