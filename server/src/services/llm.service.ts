import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import { IAnswer } from "../models/testimonialResponse.model";
import AppError from "../utils/AppError";
import { buildReviewPrompt } from "../prompts/review.prompt";



const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });


export const BANNED_WORDS = [
     "seamless",
  "leverage",
  "cutting-edge",
  "tailored solutions",
  "exceeded expectations",
  "highly recommend",
  "great experience",
  "professional",
  "top-notch",
  "world-class",
  "game-changer",
  "transformative",
  "innovative",
  "dedicated",
  "passionate",
  "synergy",
  "robust",
  "scalable",
  "delighted",
  "thrilled",
].join(", ")

const TONE_INSTRUCTIONS: Record<"casual" | "professional" | "emotional", string>= {
    casual: `
    Write like a friend recommending something to another friend.
    Short sentences. Conversational. Slight informality is fine.
    Example feel: "Honestly didn't expect it to go this smoothly..."
  `,
  professional: `
    Write clearly and confidently. Suitable for a B2B context.
    Factual, direct, no fluff. No exclamation marks.
    Example feel: "The project was delivered on schedule with clear communication throughout..."
  `,
  emotional: `
    Focus on how the client felt during and after the experience.
    Warm, personal, story-driven. Show the transformation.
    Example feel: "I was completely stuck before reaching out. What happened next..."
  `,
}
const getSystemInstruction = (businessTitle: string): string => {
    return `
    You are writing a genuine client testimonial for a business called "${businessTitle}".

Your job is to transform the client's raw answers into a natural, human-sounding testimonial.

STRICT RULES:
- Write in first person ("I", "we", "my")
- Keep the client's original words and phrases wherever possible
- Do NOT add facts, numbers, or details that were not in the answers
- Do NOT use these words: ${BANNED_WORDS}
- Sound like a real person talking, not a press release
- Length: 3 to 5 sentences maximum
- Do NOT start with filler like "I had a great experience" or "I would like to say"
- Start with something specific from their answers
- No quotes around the output
- No intro, no explanation, no sign-off — just the testimonial text
    `.trim()
}
const buildPrompt = (
    answers: IAnswer[],
    tone: "casual" | "professional" | "emotional",
  
): string => {
    const formattedAnswers = answers
        .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
        .join("\n\n")
    
    return `


TONE INSTRUCTION:
${TONE_INSTRUCTIONS[tone]}

CLIENT ANSWERS:
${formattedAnswers}

Write only the testimonial text now.
  `.trim();
};


export const generateTestimonial = async(
    answers: IAnswer[],
    tone: "casual" | "professional" | "emotional",
    businessTitle:string
): Promise<string> => {
    try {
        const draftResult = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildPrompt(answers, tone),
            config: {
                systemInstruction: getSystemInstruction(businessTitle),
                temperature:0.7
            }
        })

        const draft = draftResult.text?.trim();

        if (!draft) {
            throw new AppError("Failed to generate testimonial",500)
        }

        const reviewResult = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildReviewPrompt(draft),
            config: {
                temperature:0.2
            }
        })

        const finalTestimonial = reviewResult.text?.trim();

        if (!finalTestimonial) {
            throw new AppError("Failed to review testimonial",500)
        }

        return finalTestimonial;

    } catch (error) {
        if (error instanceof AppError) throw error;

        throw new AppError(
            "AI service is currently unavailable. Please try again later",
            503
        )
    }
}