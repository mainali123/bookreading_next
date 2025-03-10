"use client";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import TextInput from "@/components/form/TextInput";
import PasswordInput from "@/components/form/PasswordInput";
import {RegisterFormType, RegisterFormTypeDTO} from "@/types/register";
import {registerUser} from "@/lib/auth";
import {Checkbox} from "@/components/ui/checkbox";

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentPropsWithoutRef<"form">) {
    const form = useForm<RegisterFormTypeDTO>({
        resolver: zodResolver(RegisterFormType),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    function onSubmit(values: RegisterFormTypeDTO) {
        console.log(values);
        registerUser(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="grid gap-8">

                    <TextInput
                        control={form.control}
                        name="fullName"
                        label="Full name"
                        placeholder="john@doe.com"
                        type="text"
                        required={true}
                    />

                    <TextInput
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="john@doe.com"
                        type="email"
                        required={true}
                    />

                    <PasswordInput
                        control={form.control}
                        name="password"
                        label="Password"
                        type="password"
                        required={true}
                    />
                    <PasswordInput
                        control={form.control}
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        required={true}
                    />

                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" name="terms_and_services"/>
                        <label
                            htmlFor="terms"
                            className="text-sm "
                        >
                            I agree to the <strong className="underline">Term of Usage</strong> and <strong
                            className="underline">Privacy Policy</strong>
                        </label>
                    </div>

                    <div className="flex justify-center w-full">
                        <Button type="submit" className="w-1/2">
                            Register
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
        ;
}