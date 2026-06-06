import { Router } from "express"; 
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import validate from "../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "../validations/user.validation";
import { getMeController, updateProfileController, changePasswordController, deleteAccountController,uploadAvatarController } from "../controllers/user.controller";


const router = Router();

router.use(protect);

router.get("/me", getMeController);
router.patch("/me", validate(updateProfileSchema), updateProfileController);
router.patch("/me/change-password", validate(changePasswordSchema), changePasswordController);
router.patch("/me/avatar",upload.single("avatar"),uploadAvatarController)
router.delete("/me", validate(deleteAccountSchema), deleteAccountController);

export default router