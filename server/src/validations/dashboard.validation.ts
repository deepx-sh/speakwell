import { z } from "zod"

export const dashboardTestimonialsQuerySchema = z.object({
    status: z
        .enum(["PENDING", "APPROVED", "REJECTED"], {
            error:()=>({message:"Invalid status filter"})
        })
        .optional(),
    
    isPublished: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    
    requestId: z
        .string()
        .refine((val) => /^[a-f\d]{24}$/i.test(val), "Invalid request ID")
        .optional(),
    
    page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1, "Page must be at least 1"))
        .optional(),
    
    limit: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1).max(50, "Limit cannot exceed 50"))
        .optional(),
    
    sortBy: z
        .enum(["createdAt", "rating"], {
            error: () => ({ message: "Invalid sort field" }),
        })
        .optional(),
    
    order: z
        .enum(["asc", "desc"], {
            error: () => ({ message: "Invalid sort order" })
        })
        .optional()
})