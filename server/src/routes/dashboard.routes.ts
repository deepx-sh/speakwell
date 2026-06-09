import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { dashboardTestimonialsQuerySchema } from "../validations/dashboard.validation";
import { getDashboardStatsController, getDashboardTestimonialsController, getRecentActivityController } from "../controllers/dashboard.controller";

const router = Router();

router.use(protect);

router.get("/stats", getDashboardStatsController);
router.get("/testimonials", validate(dashboardTestimonialsQuerySchema, "query"), getDashboardTestimonialsController)
router.get("/recent-activity", getRecentActivityController)

export default router;