import express from "express";
import validate from "../middlewares/validate.middleware";
import { forgotPasswordSchema, resetPasswordSchema, resendOtpSchema, loginSchema, registerSchema, verifyOtpSchema } from "../validations/auth.validation";
import { registerController, loginController, logoutController, verifyEmailController, resendOtpController, forgotPasswordController, resetPasswordController, refreshTokenController } from "../controllers/auth.controller";
const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    registerController
)

router.post(
    "/verify-email",
    validate(verifyOtpSchema),
    verifyEmailController
)

router.post(
    "/login",
    validate(loginSchema),
    loginController
)

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPasswordController
)

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPasswordController
)

router.post(
    "/resend-otp",
    validate(resendOtpSchema),
    resendOtpController
)
router.post(
    "/refresh-token",
    refreshTokenController
)

router.post(
    "/logout",
    logoutController
)

export default router;