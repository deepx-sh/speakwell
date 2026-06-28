import { z } from "zod";

export const questionSchema = z.object({
    question: z
        .string()
        .trim()
        .min(5, "Question too short")
        .max(200, "Question too long"),
    
    required: z
        .boolean(),
        
    type: z.enum(["text", "textarea", "rating"])
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
        .enum(["light", "dark"]),
    
    allowAnonymous: z.boolean(),
    
    expiresAt: z.string().optional().nullable()
})