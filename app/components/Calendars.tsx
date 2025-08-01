import { Calendar } from "react-native-calendars";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { CalendarContext } from "../context/CalenderContext";

export default function Calendars() {
    const calendarContext = useContext(CalendarContext);
    if (!calendarContext) {
        throw new Error("CalendarContext가 제공되지 않았습니다.");
    }

    const {
        travelStartDate,
        setTravelStartDate,
        travelEndDate,
        setTravelEndDate,
    } = calendarContext;

    // 시작 날짜와 종료 날짜 사이의 날짜를 계산
    const getMarkedDates = () => {
        const markedDates: { [date: string]: any } = {};

        if (travelStartDate) {
            markedDates[travelStartDate] = {
                startingDay: true,
                color: "#E17055",
                textColor: "#FFFFFF",
            };
        }

        if (travelEndDate) {
            markedDates[travelEndDate] = {
                endingDay: true,
                color: "#E17055",
                textColor: "#FFFFFF",
            };

            // 시작 날짜와 종료 날짜 사이의 날짜 계산
            let currentDate = new Date(travelStartDate);
            const endDate = new Date(travelEndDate);

            while (currentDate < endDate) {
                currentDate.setDate(currentDate.getDate() + 1);
                const formattedDate = currentDate.toISOString().split("T")[0];
                if (formattedDate !== travelEndDate) {
                    markedDates[formattedDate] = {
                        color: "#E17055",
                        textColor: "#FFFFFF",
                    };
                }
            }
        }

        return markedDates;
    };

    return (
        <Calendar
            style={styles.calendar}
            current={new Date().toISOString().split("T")[0]}
            markingType={"period"}
            markedDates={getMarkedDates()}
            onDayPress={(day) => {
                if (!travelStartDate || (travelStartDate && travelEndDate)) {
                    // 시작 날짜 설정
                    setTravelStartDate(day.dateString);
                    setTravelEndDate(""); // 종료 날짜 초기화
                } else if (!travelEndDate) {
                    // 종료 날짜 설정
                    if (day.dateString < travelStartDate) {
                        setTravelStartDate(day.dateString);
                    } else {
                        setTravelEndDate(day.dateString);
                    }
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    calendar: {
        borderRadius: 12,
        padding: 12,
    },
});
