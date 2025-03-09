"use client";

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {isAuthenticated} from "@/lib/auth";
import {ROUTES} from "@/constants/routes";

const PUBLIC_ROUTES = [ROUTES.root, ROUTES.login, ROUTES.register];
const AUTH_ROUTES = [ROUTES.login, ROUTES.register];

export function AuthMiddleware({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        setAuthenticated(isAuthenticated()); // Ensure this only runs on the client
    }, []);

    useEffect(() => {
        if (authenticated === null || !pathname) return;

        if (authenticated && AUTH_ROUTES.includes(pathname)) {
            router.replace(ROUTES.dashboard.root);
        } else if (!authenticated && !PUBLIC_ROUTES.includes(pathname)) {
            router.replace(ROUTES.login);
        }
    }, [authenticated, pathname]);

    // Prevent rendering children until auth state is known
    if (authenticated === null) return null;

    return <>{children}</>;
}
