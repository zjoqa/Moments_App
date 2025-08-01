import { createContext } from "react";

interface CalendarContextType {
    travelStartDate: string;
    setTravelStartDate: (date: string) => void;
    travelEndDate: string;
    setTravelEndDate: (date: string) => void;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
    undefined
);
