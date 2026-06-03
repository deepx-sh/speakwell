import { z } from "zod";

export const tokenParamSchema = z.object({
    token:z.string().min(6,"Invalid token")
})
export const updateWidgetSettingsSchema = z.object({
    primaryColor: z
        .string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color")
        .optional(),
    
    theme: z
        .enum(["light", "dark"], {
            error: () => ({ message: "Invalid theme" })
        })
        .optional(),
    
    layout: z
        .enum(["card", "carousel", "list"], {
            error: () => ({ message: "Invalid layout" })
        })
        .optional(),
    
    fontFamily: z
        .enum(["inherit", "inter", "serif"], {
            error:()=>({message:"Invalid font family"})
        })
        .optional(),
    
    borderRadius: z
        .enum(["none", "small", "medium", "large"], {
            error:()=>({message:"Invalid border radius"})
        }),
    
    showVerifiedBadge: z.boolean().optional(),
    showRating: z.boolean().optional(),
    showAvatar: z.boolean().optional(),
    showCompany: z.boolean().optional(),
    
    maxTestimonialsToShow: z
        .number()
        .min(1, "Must show at least 1")
        .max(10, "Cannot show more than 10")
        .optional()
})