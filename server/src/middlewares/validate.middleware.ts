import { NextFunction, Request, Response } from "express";
import z from "zod";

type ValidateTarget = "body" | "params" | "query"

const validate = (schema: z.ZodType, target: ValidateTarget = "body") => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }))

        return next({
            statusCode: 400,
            message: errors[0]?.message,
            errors
        })
    }
    if (target === "query") {
        Object.assign(req.query,result.data)
    } else {
        req[target] = result.data;
    }
    next();
}

export default validate