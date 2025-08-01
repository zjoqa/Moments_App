import { useContext, useState } from "react";
import Modal from "react-native-modal";
import { View, Pressable, TextInput, StyleSheet } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Firebase 인증 모듈 import

import CustomText from "@/CustomText";
import Calendars from "./Calendars";

import { ModalContext } from "../context/ModalContext";
import { CalendarContext } from "../context/CalenderContext";
import { router } from "expo-router";

export default function MakingDiaryModal() {
    const [travelTitle, setTravelTitle] = useState("");

    const modalContext = useContext(ModalContext);
    const calendarContext = useContext(CalendarContext);

    if (!modalContext) {
        throw new Error("ModalContext가 제공되지 않았습니다.");
    }
    if (!calendarContext) {
        throw new Error("CalendarContext가 제공되지 않았습니다.");
    }

    const { makingDiaryModalVisible } = modalContext;

    const { travelStartDate, travelEndDate } = calendarContext;

    const travelData = {
        title: travelTitle,
        startDate: travelStartDate,
        endDate: travelEndDate,
        userId: auth.currentUser?.uid, // 현재 로그인한 사용자의 UID
    };

    const SaveInfo = async () => {
        try {
            const docRef = await addDoc(collection(db, "travels"), travelData);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        router.replace("/(main)/mainPage");
    };

    return (
        <Modal
            isVisible={makingDiaryModalVisible}
            backdropColor="black"
            backdropOpacity={0.25}
            animationIn="fadeIn"
            animationOut="fadeOut"
            useNativeDriver={true} // 애니메이션 문제 방지
        >
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <CustomText style={styles.title}>
                            이 순간을 어떻게 남기고 싶나요?
                        </CustomText>
                        <View style={[styles.inputContainer, styles.shadow]}>
                            <TextInput
                                style={styles.input}
                                placeholder="여행의 제목을 입력해주세요"
                                value={travelTitle}
                                onChangeText={setTravelTitle}
                            />
                        </View>
                        <View style={[styles.calendarContainer, styles.shadow]}>
                            <Calendars />
                        </View>
                        <View style={styles.footer}>
                            <CustomText style={styles.footerText}>
                                여행 제목 : {travelTitle}
                            </CustomText>
                            <CustomText style={styles.footerText}>
                                여행 기간 : {travelStartDate} ~ {travelEndDate}
                            </CustomText>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.button} onPress={SaveInfo}>
                                <CustomText style={styles.buttonText}>
                                    지금 시작하세요!
                                </CustomText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    modal: {
        backgroundColor: "#FFF7F2",
        width: 345,
        height: 725,
        borderRadius: 24,
        alignSelf: "center",
        position: "relative",
    },
    modalContent: {
        paddingLeft: 24,
        paddingRight: 24,
    },
    header: {
        alignItems: "center",
        marginTop: 45,
    },
    closeButton: {
        position: "absolute",
        top: 24,
        left: 24,
    },
    title: {
        fontSize: 24,
        lineHeight: 36,
        letterSpacing: -1.44,
        fontWeight: "bold",
        textAlign: "left",
        color: "#E17055",
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 24,
    },
    input: {
        borderRadius: 12,
        width: 250,
        height: 50,
        fontSize: 16,
        fontWeight: "500",
        color: "rgba(52,73,94,60)",
        lineHeight: 20,
        textAlign: "center",
        backgroundColor: "#F4F6F6",
    },
    shadow: {
        shadowColor: "#000", // 그림자 색상
        shadowOffset: { width: 0, height: 4 }, // 그림자 위치
        shadowOpacity: 0.08, // 그림자 투명도
        shadowRadius: 16, // 그림자 반경
        elevation: 5, // Android에서의 그림자 효과
    },
    errorContainer: {
        alignItems: "center",
        marginTop: -8,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: "#FF6B6B",
        textAlign: "center",
        fontWeight: "500",
    },
    orText: {
        textAlign: "center",
        color: "#999",
        fontSize: 16,
        marginTop: 20,
    },
    socialIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        marginTop: 16,
    },
    socialButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "",
    },
    socialIcon: {
        width: 50,
        height: 50,
    },
    calendarContainer: {
        width: "100%",
        marginTop: 24,
        borderRadius: 12,
    },
    footer: {
        width: "100%",
        paddingTop: 24,
    },
    footerText: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "600",
        textAlign: "left",
        color: "#767676",
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        width: "100%",
    },
    button: {
        width: 256,
        height: 56,
        borderRadius: 100,
        backgroundColor: "#E17055",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 18,
        lineHeight: 24,
        color: "#FEFEFE",
        textAlign: "center",
        fontWeight: "600",
    },
});
