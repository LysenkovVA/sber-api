import { ThemeConfig } from "antd";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";

export const PRIMARY_COLOR = "#43ae3b";
export const PRIMARY_VARIANT_COLOR = "#538fec";
export const SECONDARY_COLOR = "#a9d5a4";
export const SECONDARY_VARIANT_COLOR = "#50c645";
export const BACKGROUND_COLOR = "#f9f9fb";
export const SURFACE_COLOR = "#FFFFFF";
export const ERROR_COLOR = "#B00020";
export const WARNING_COLOR = "#c88240";
export const SUCCESS_COLOR = "#43ae3b";
export const ON_PRIMARY_COLOR = "#FFFFFF";
export const ON_SECONDARY_COLOR = "#000000";
export const ON_BACKGROUND_COLOR = "#000000";
export const ON_SURFACE_COLOR = "#000000";
export const ON_ERROR_COLOR = "#FFFFFF";

export const primaryTheme: ThemeConfig = {
    token: {},
    components: {
        Layout: {
            // Component token
            bodyBg: BACKGROUND_COLOR,
            footerBg: PRIMARY_COLOR,
            footerPadding: "24px 50px",
            headerBg: PRIMARY_COLOR,
            headerColor: ON_PRIMARY_COLOR,
            headerHeight: HEADER_HEIGHT,
            headerPadding: "0 50px",
            lightSiderBg: "#ffffff",
            lightTriggerBg: "#ffffff",
            lightTriggerColor: "rgba(0,0,0,0.88)",
            siderBg: "#001529",
            triggerBg: "#002140",
            triggerColor: "#fff",
            triggerHeight: 48,
            zeroTriggerHeight: 40,
            zeroTriggerWidth: 40,
            // Global token
            colorText: ON_PRIMARY_COLOR,
            fontSize: 14,
        },
        Button: {
            // Primary
            primaryColor: ON_SECONDARY_COLOR,
            colorPrimary: SECONDARY_COLOR,
            colorPrimaryHover: SECONDARY_VARIANT_COLOR,
            defaultBorderColor: PRIMARY_COLOR,
            // Global token
        },
        FloatButton: {
            // Primary
            colorPrimary: SECONDARY_COLOR,
            colorPrimaryHover: SECONDARY_VARIANT_COLOR,
            colorBgElevated: SECONDARY_VARIANT_COLOR,
        },
        Card: {
            // Component token
            actionsBg: SURFACE_COLOR,
            actionsLiMargin: "12px 0",
            bodyPadding: 24,
            bodyPaddingSM: 12,
            extraColor: ON_SURFACE_COLOR,
            headerBg: SURFACE_COLOR,
            headerFontSize: 16,
            headerFontSizeSM: 14,
            headerHeight: 56,
            headerHeightSM: 38,
            headerPadding: 24,
            headerPaddingSM: 12,
            tabsMarginBottom: -17,
            // Global token
            colorBorderSecondary: PRIMARY_COLOR,
        },
        Tabs: {
            cardBg: SURFACE_COLOR,
            cardGutter: 2,
            cardHeight: 40,
            cardPadding: "8px 16px",
            cardPaddingLG: "8px 16px 6px",
            cardPaddingSM: "6px 16px",
            horizontalItemGutter: 32,
            // horizontalItemMargin
            // horizontalItemMarginRTL
            horizontalItemPadding: "12px 0",
            horizontalItemPaddingLG: "16px 0",
            horizontalItemPaddingSM: "8px 0",
            horizontalMargin: "0 0 16px 0",
            inkBarColor: "#1677ff", // Color of indicator
            itemActiveColor: "#0958d9", // Text color of active tab
            itemColor: "rgba(0,0,0,0.88)", // Text color of tab
            itemHoverColor: "#4096ff", // Text color of hover tab
            itemSelectedColor: "#1677ff", // Text color of selected tab
            titleFontSize: 14,
            titleFontSizeLG: 16,
            titleFontSizeSM: 14,
            verticalItemMargin: "16px 0 0 0",
            verticalItemPadding: "8px 24px",
            zIndexPopup: 1050,
            // Global token
            colorBorder: PRIMARY_COLOR,
            colorBorderSecondary: PRIMARY_VARIANT_COLOR,
        },
        Input: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        DatePicker: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Select: {
            // Component token
            activeBorderColor: SECONDARY_COLOR,
            hoverBorderColor: SECONDARY_VARIANT_COLOR,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Tree: {
            // Component token
            indentSize: 24,
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
        Collapse: {
            contentPadding: "8px 8px",
            headerBg: SURFACE_COLOR,
            headerPadding: "12px 8px",
            // Global token
            colorBorder: PRIMARY_VARIANT_COLOR,
        },
    },
};
