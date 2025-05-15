import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateTimeHelper {
    static Now(timeZone?: "Europe/Moscow"): string {
        try {
            const now = dayjs();
            return now.tz(timeZone).format();
        } catch (error) {
            console.log("Error getting now date for timezone: ", timeZone);
            throw error;
        }
    }
}
