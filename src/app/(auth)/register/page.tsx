import {RegisterForm} from "@/pages/register/register-form";
import {ROUTES} from "@/constants/routes";

export default function loginPage() {
    return (
        <>
            {/* TODO: LOGO HERE*/}
            <h1 className="py-5 text-[50px] border-b font-cmu-serif text-center">App Name Here</h1>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <h1 className="text-[40px] font-cmu-serif text-center">Get Started with AppName</h1>
                <p className="text-lg text-center p-3">Get started with us. More than 2.5 million people use and trust
                    us.</p>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-lg">
                        <RegisterForm/>
                    </div>
                </div>
                <div className="text-center text-sm pt-2">
                    Don&apos;t have an account?{" "}
                    <a href={ROUTES.login} className="underline underline-offset-4">
                        Login
                    </a>
                </div>
            </div>
        </>
    )
}