import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { tokenParamSchema,updateWidgetSettingsSchema } from "../validations/widget.validation";
import { getWidgetDataController, serveEmbedScriptController, getWidgetSettingsController, updateWidgetSettingsController, getEmbedSnippetController } from "../controllers/widget.controller";

const router = Router();

router.get("/embed/:token", serveEmbedScriptController);

router.get("/:token", validate(tokenParamSchema, "params"), getWidgetDataController)

router.use(protect);

router.get("/settings", getWidgetSettingsController);
router.patch("/settings", validate(updateWidgetSettingsSchema), updateWidgetSettingsController);
router.get("/snippet/:token", validate(tokenParamSchema, "params"), getEmbedSnippetController)

export default router