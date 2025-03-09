import {api} from "@/lib/auth";
import {RegisterFormTypeDTO} from "@/types/register";

export const me = async () => {
    await api.get("/me")
}

export const register = async (data: RegisterFormTypeDTO) => {
    await api.post("/register", data)
}