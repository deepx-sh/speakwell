import { z } from "zod";

const questionSchema = z.object({
    question: z
        .string()
        .trim()
        .min(5, "Question too short")
        .max(200, "Question too long"),
    
    required: z
        .boolean()
        .default(true),
    
    type: z.enum(["text", "textarea", "rating"], {
        error:()=>({message:"Invalid quesiton type"})
    })
})


export const createRequestSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title too short")
        .max(100, "Title too long"),
    
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required")
        .max(8, "Maximum 8 questions allowed"),
    
    theme: z
        .enum(["light", "dark"], {
            error:()=>({message:"Invalid theme"})
        })
        .default("light"),
    
    allowAnonymous: z
        .boolean()
        .default(false),
    
    expiresAt: z
        .iso
        .datetime({ message: "Invalid date format" })
        .optional()
        .nullable()
})

export const updateRequestSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title too short")
        .max(100, "Title too long")
        .optional(),
    
    questions: z
        .array(questionSchema)
        .min(1, "At least one question is required")
        .max(8, "Maximum 8 questions allowed")
        .optional(),
    theme: z
        .enum(["light", "dark"], {
            error:()=>({message:"Invalid theme"})
        })
        .optional(),
    
    allowAnonymous: z
        .boolean()
        .optional(),
    
    expiresAt: z
        .iso
        .datetime({ message: "Invalid date format" })
        .optional()
        .nullable()
})

export const tokenParamSchema = z.object({
    token: z
        .string()
        .min(6,"Invaild token")
})

export const requestIdParamSchema = z.object({
    id: z
        .string()
        .min(1, "Request ID is required")
        .refine(
            (val) => /^[a-f\d]{24}$/i.test(val),
            "Invalid request ID"
        )
})