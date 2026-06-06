import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { submitResponseSchema, approveResponseSchema, responseIdParamSchema, tokenParamSchema, requestIdParamSchema } from '../validations/response.validation';
import { submitResponseController, getResponseByRequestController, getResponseByIdController, approveResponseController, rejectResponseController, togglePublishResponseController, deleteResponseController,uploadClientAvatarController } from '../controllers/response.controller';

const router = Router();

router.post(
    "/submit/:token",
    validate(tokenParamSchema, "params"),
    validate(submitResponseSchema),
    submitResponseController
)

router.use(protect)

router.get(
    "/request/:requestId",
    validate(requestIdParamSchema, "params"),
    getResponseByRequestController
)

router.get(
    "/:id",
    validate(responseIdParamSchema, "params"),
    getResponseByIdController
)

router.patch(
    "/:id/approve",
    validate(responseIdParamSchema, "params"),
    validate(approveResponseSchema),
    approveResponseController
)

router.patch(
    "/:id/reject",
    validate(responseIdParamSchema, "params"),
    rejectResponseController
)

router.patch(
    "/:id/publish",
    validate(responseIdParamSchema, "params"),
    togglePublishResponseController
)

router.patch("/:id/avatar",validate(responseIdParamSchema,"params"),upload.single("avatar"),uploadClientAvatarController)
router.delete(
    "/:id",
    validate(responseIdParamSchema, "params"),
    deleteResponseController
)

export default router;