import {z} from "zod";

export const LoginFormType = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string({message: "Password is required"})
})
export type LoginFormTypeDTO = z.infer<typeof LoginFormType>