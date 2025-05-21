export interface SberClientInfoErrorResponse {
    cause: string;
    referenceId: string;
    message: string;
    checks: [{ level: string; message: string; fields: string[] }];
}
