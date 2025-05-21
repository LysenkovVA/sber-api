/**
 * https://developers.sber.ru/docs/ru/sber-api/specifications/client-info/get-client-info
 */
export interface SberClientInfoEntity {
    shortName?: string;
    fullName?: string;
    resident?: boolean;
    ogrn?: string;
    inn?: string;
    okpo?: string;
    okato?: string;
    orgForm?: string;
    territorialBank?: string;
    orgPprbId?: number;
    orgRegDateINN?: string;
    orgRegDateOGRN?: string;
    nonClient?: boolean;
    orgUnconfirmed?: boolean;
    eksEpkId?: number;
    isCorpCardHolder?: boolean;
    hasActiveCreditLine?: boolean;
    creditLineAvailableSum?: string; // TODO конвертация из number
    branch?: {
        name?: string;
        address?: string;
        code?: string;
    };
    orgKindActivityInfo?: {
        code?: number;
        name?: string;
    };
    addresses?: [
        {
            type?: string;
            country?: string;
            zip?: string;
            region?: string;
            area?: string;
            city?: string;
            settlementType?: string;
            settlement?: string;
            street?: string;
            house?: string;
            building?: string;
            flat?: string;
            fullAddress?: string;
        },
    ];
    accounts?: [
        {
            number?: string;
            name?: string;
            currencyCode?: string;
            bic?: string;
            type?:
                | "assuranceRegistration"
                | "calculated"
                | "transit"
                | "specialTransit"
                | "budget"
                | "loan"
                | "deposit";
            openDate?: Date;
            closeDate?: Date;
            state?: "OPEN" | "BLOCKED" | "RESERVED" | "CLOSED";
            dbo?: boolean;
            business?: boolean;
            minBalance?: string; // TODO конвертация из number
            cdiPermDocQnt?: number;
            cdiPermDocSum?: string; // TODO конвертация из number
            cdiAcptDocQnt?: number;
            cdiAcptDocSum?: string; // TODO конвертация из number
            cdiCart2DocQnt?: number;
            cdiCart2DocSum?: string; // TODO конвертация из number
            debitBlocked?: boolean;
            debitBlockedCause?: string;
            debitBlockedBeginDate?: Date;
            debitBlockedEndDate?: Date;
            creditBlocked?: boolean;
            creditBlockedCause?: string;
            creditBlockedBeginDate?: Date;
            creditBlockedEndDate?: Date;
            blockedSums?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
            blockedQueuesInfo?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
            blockedSumQueuesInfo?: [
                {
                    sum?: string; // TODO конвертация из number
                    cause?: string;
                    blockedQueues?: number;
                    beginDate?: Date;
                    endDate?: Date;
                },
            ];
        },
    ];
    kpps?: string[];
    dboContracts?: [
        {
            number?: string;
            date?: Date;
        },
    ];
}
