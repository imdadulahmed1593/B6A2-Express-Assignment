import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, role, email, password } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, role, email, password) VALUES($1, $2, $3, $4) RETURNING *`,
    [name, role, email, hashedPass]
  );

  return result;
};

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleuser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  return result;
};

const updateUser = async (
  payload: Record<string, unknown>,
  id: string,
  userRole?: string
) => {
  const { name, email, phone, role } = payload;

  // Build dynamic query based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name=$${paramCount}`);
    values.push(name);
    paramCount++;
  }

  if (email !== undefined) {
    updates.push(`email=$${paramCount}`);
    values.push(email);
    paramCount++;
  }

  if (phone !== undefined) {
    updates.push(`phone=$${paramCount}`);
    values.push(phone);
    paramCount++;
  }

  // Only allow role update for admin
  if (role !== undefined && userRole === "admin") {
    updates.push(`role=$${paramCount}`);
    values.push(role);
    paramCount++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  // Add updated_at timestamp
  updates.push(`updated_at=NOW()`);

  // Add id as the last parameter
  values.push(id);

  const query = `UPDATE users SET ${updates.join(
    ", "
  )} WHERE id=$${paramCount} RETURNING *`;

  const result = await pool.query(query, values);

  return result;
};

const deleteUser = async (id: string) => {
  // Check if user has active bookings
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error(
      "Cannot delete user with active bookings. Please complete or cancel all active bookings first."
    );
  }

  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleuser,
  updateUser,
  deleteUser,
};

