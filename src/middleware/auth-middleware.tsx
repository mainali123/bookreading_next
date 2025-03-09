"use client";

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {isAuthenticated} from "@/lib/auth";
import {ROUTES} from "@/constants/routes";

// const PUBLIC_ROUTES = [ROUTES.root, ROUTES.login, ROUTES.register];
const PUBLIC_ROUTES = [ROUTES.root];
const AUTH_ROUTES = [ROUTES.root];

// const AUTH_ROUTES = [ROUTES.login, ROUTES.register];

export function AuthMiddleware({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = isAuthenticated();
            const currentPath = pathname || "";

            if (authenticated && AUTH_ROUTES.includes(currentPath)) {
                router.replace(ROUTES.dashboard.root);
            } else if (!authenticated && !PUBLIC_ROUTES.includes(currentPath)) {
                router.replace(ROUTES.login);
            } else {
                setAuthorized(true);
            }

            setLoading(false);
        };

        checkAuth();
    }, [pathname, router]);

    // TODO: Loading spinner
    if (loading || !authorized) return null;

    return <>{children}</>;
}