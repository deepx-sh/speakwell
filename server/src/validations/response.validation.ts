import { z } from "zod";

const answerSchema = z.object({
    question: z
        .string()
        .trim()
        .min(1, "Question is required"),
    
    answer: z
        .string()
        .trim()
        .min(1, "Answer cannot be empty")
        .max(2000,"Answer too long")
})

export const submitResponseSchema = z.object({
    clientName: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long"),
    
    clientEmail:z
        .string()
        .check(z.trim(), z.email("Invalid email address"), z.toLowerCase())
        .nullable()
        .optional()
        .transform((val)=>(val==="" ? null :val)),
    
    clientCompany: z
        .string()
        .trim()
        .max(100, "Company name too long")
        .nullable()
        .optional()
        .transform((val)=>(val==="" ? null :val)),
    
    rating: z
        .number()
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),
    
    answers: z
        .array(answerSchema)
        .min(1, "At least one answer is required"),
    
    tone: z.enum(["casual", "professional", "emotional"], {
        error:()=>({message:"Invalid tone"})
    }).default("casual")
})


export const approveResponseSchema = z.object({
    approvedTestimonial: z
        .string()
        .trim()
        .min(20, "Testimonial too short")
        .max(3000,"Testimonial too long")
})


export const responseIdParamSchema = z.object({
    id: z
        .string()
        .min(1, "Response ID is required")
        .refine(
            (val) => /^[a-f\d]{24}$/i.test(val),
            "Invalid response ID"
        )
})

export const tokenParamSchema = z.object({
    token: z
        .string()
        .min(6,"Invalid token")
})

export const requestIdParamSchema = z.object({
    requestId: z
        .string()
        .min(1, "Request ID is required")
        .refine((val)=>/^[a-f\d]{24}$/i.test(val),"Invalid request ID")
})