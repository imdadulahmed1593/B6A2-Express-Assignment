import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
  return result;
};

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  // Build dynamic query based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name=$${paramCount}`);
    values.push(vehicle_name);
    paramCount++;
  }

  if (type !== undefined) {
    updates.push(`type=$${paramCount}`);
    values.push(type);
    paramCount++;
  }

  if (registration_number !== undefined) {
    updates.push(`registration_number=$${paramCount}`);
    values.push(registration_number);
    paramCount++;
  }

  if (daily_rent_price !== undefined) {
    updates.push(`daily_rent_price=$${paramCount}`);
    values.push(daily_rent_price);
    paramCount++;
  }

  if (availability_status !== undefined) {
    updates.push(`availability_status=$${paramCount}`);
    values.push(availability_status);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  // Add updated_at timestamp
  updates.push(`updated_at=NOW()`);

  // Add id as the last parameter
  values.push(id);

  const query = `UPDATE vehicles SET ${updates.join(
    ", "
  )} WHERE id=$${paramCount} RETURNING *`;

  const result = await pool.query(query, values);
  return result;
};

const deleteVehicle = async (id: string) => {
  // Check if vehicle has active bookings
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  console.log(activeBookings);

  if (activeBookings.rows.length > 0) {
    throw new Error(
      "Cannot delete vehicle with active bookings. Please complete or cancel all active bookings first."
    );
  }

  const result = await pool.query(
    "DELETE FROM vehicles WHERE id=$1 RETURNING *",
    [id]
  );
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

