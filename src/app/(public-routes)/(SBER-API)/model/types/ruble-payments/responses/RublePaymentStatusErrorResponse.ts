export interface RublePaymentStatusErrorResponse {
    checks?: [
        {
            level?: string;
            message?: string;
            fields?: string[];
        },
    ];
    cause?: string;
    message?: string;
    referenceId?: string;
    internalErrorCode?: string;
}
