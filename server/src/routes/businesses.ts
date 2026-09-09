import { Router } from "express";
import * as controller from "../controllers/businessController.js";

const router = Router();

router.get("/search", controller.search);
router.get("/:id", controller.getById);
router.get("/:id/trust", controller.getTrust);
router.get("/:id/reports", controller.getReports);
router.get("/:id/reviews", controller.getReviews);
router.post("/:id/reports", controller.createReport);
router.post("/:id/confirm", controller.createConfirmation);

export default router;
