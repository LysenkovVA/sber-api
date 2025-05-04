"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function ClientErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary fallback={<div>Ошибка в клиентском компоненте</div>}>
            {children}
        </ErrorBoundary>
    );
}
