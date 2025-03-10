import {z} from "zod";

export const RegisterFormType = z.object({
    fullName: z.string().min(3, {message: "First name must be at least 3 characters"}),
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(1, {message: "Password is required"}),
    confirmPassword: z.string().min(1, {message: "Password is required"}),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterFormTypeDTO = z.infer<typeof RegisterFormType>

export type  registerRes = {
    data: string,
}