import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";

import { createRequestSchema, updateRequestSchema, tokenParamSchema, requestIdParamSchema } from "../validations/request.validation";

import { createRequestController, getRequestsByOwnerController, getRequestByIdController, getRequestByTokenController, updateRequestController, closeRequestController, deleteRequestController } from "../controllers/request.controller";

const router = Router();

router.get("/form/:token", validate(tokenParamSchema, "params"), getRequestByTokenController);

router.use(protect);

router.post("/", validate(createRequestSchema), createRequestController);
router.get("/", getRequestsByOwnerController);
router.get("/:id", validate(requestIdParamSchema, "params"), getRequestByIdController);
router.patch("/:id", validate(requestIdParamSchema, "params"), validate(updateRequestSchema), updateRequestController);
router.patch("/:id/close", validate(requestIdParamSchema, "params"), closeRequestController);
router.delete("/:id", validate(requestIdParamSchema, "params"), deleteRequestController)

export default router;