import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: result.rows,
      });
    }

    res.status(200).json({
      success: true,
      message: "vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicleById(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateVehicle(
      req.body,
      req.params.id!
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(req.params.id!);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ success: true, message: "Vehicle deleted", data: null });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};

