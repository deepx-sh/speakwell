import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { apiResponse } from "../utils/apiResponse"
import { clearAuthCookie } from "../utils/setAuthCookies"
import { getMeService, updateProfileService, changePasswordService, deleteAccountService } from "../services/user.service"

export const getMeController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id.toString();

        const user = await getMeService(userId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Profile fetched successfully",
                data:user
            })
        )
    }
)

export const updateProfileController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id.toString();

        const { name, avatar } = req.body;

        const user = await updateProfileService(userId, { name, avatar });

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Profile updated successfully",
                data:user
            })
        )
    }
)


export const changePasswordController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id.toString();
        const { currentPassword, newPassword } = req.body;

        await changePasswordService(userId, currentPassword, newPassword);

        clearAuthCookie(res);

        return res.status(200).json(
            apiResponse({
                success: true,
                message:"Password changed successfully. Please login again"
            })
        )
    }
)

export const deleteAccountController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id.toString();
        const { password } = req.body
        
        await deleteAccountService(userId, password);
        
        clearAuthCookie(res);

        return res.status(200).json(
            apiResponse({
                success: true,
                message:"Account deleted successfully. Sorry to see you go"
            })
        )
    }
)