import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../config/env";
import { SendEmailOptions } from "../types/email.types";

const client = new BrevoClient({
    apiKey:env.BREVO_API_KEY
})

export const sendEmail = async ({ to, subject, htmlContent }: SendEmailOptions) => {
    try {
        await client.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: htmlContent,
            sender: {
                name: "Speakwell",
                email:env.BREVO_FROM_EMAIL
            },
            to: [
                {
                    email:to
                }
            ]
        })
        console.log(`Successfully email sent to ${to}`)
    } catch (error) {
        console.error("Brevo email error:", error)
        throw new Error("Failed to send email")
    }
}