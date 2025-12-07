import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

const router = Router();

router.post("/", logger, auth("admin"), vehicleControllers.createVehicle);

router.get("/", logger, vehicleControllers.getVehicles);

router.get("/:id", logger, vehicleControllers.getSingleVehicle);

router.put("/:id", logger, auth("admin"), vehicleControllers.updateVehicle);

router.delete("/:id", logger, auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;

