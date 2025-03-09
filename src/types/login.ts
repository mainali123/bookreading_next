import {z} from "zod";

export const LoginFormType = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(1, {message: "Password is required"}),
})
export type LoginFormTypeDTO = z.infer<typeof LoginFormType>

export type  loginRes = {
    tokenType?:string,
    token: string,
    user: {
        id: string,
        email: string,
        name: string,
        avatar: string
    }
}