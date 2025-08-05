import {
    View,
    ImageBackground,
    Pressable,
    ActivityIndicator,
} from "react-native";
import CustomText from "@/CustomText";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ModalContext } from "./context/ModalContext";
import { CalendarContext } from "./context/CalenderContext";

import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import MakingDiaryModal from "./components/MakingDiaryModal";

export default function StartPage() {
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [makingDiaryModalVisible, setMakingDiaryModalVisible] =
        useState(false);

    const [travelStartDate, setTravelStartDate] = useState("");
    const [travelEndDate, setTravelEndDate] = useState("");

    const router = useRouter();

    const loginHandler = () => {
        setLoginModalVisible(true);
    };

    const registerHandler = () => {
        setRegisterModalVisible(true);
    };

    const clearStorage = () => {
        AsyncStorage.clear()
            .then(() => {
                console.log("스토리지 클리어 완료");
            })
            .catch((error) => {
                console.error("스토리지 클리어 중 에러 발생:", error);
            });
    };

    return (
        <ModalContext.Provider
            value={{
                loginModalVisible,
                registerModalVisible,
                makingDiaryModalVisible,
                setLoginModalVisible,
                setRegisterModalVisible,
                setMakingDiaryModalVisible,
            }}
        >
            <CalendarContext.Provider
                value={{
                    travelStartDate,
                    setTravelStartDate,
                    travelEndDate,
                    setTravelEndDate,
                }}
            >
                <ImageBackground
                    style={styles.container}
                    source={require("../assets/images/startPageImage.jpg")}
                >
                    <View style={styles.textContainer}>
                        <CustomText style={styles.text}>
                            스쳐가는 순간들을 놓치지 마세요.
                            {"\n"}기억은 이곳에 남아요
                        </CustomText>
                        <Pressable onPress={clearStorage}>
                            <CustomText>스토리지 클리어</CustomText>
                        </Pressable>
                    </View>
                    <View>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                onPress={loginHandler}
                                style={[
                                    styles.button,
                                    { backgroundColor: "#FEFEFE" },
                                ]}
                            >
                                <CustomText
                                    style={[
                                        styles.buttonText,
                                        { color: "#34495E" },
                                    ]}
                                >
                                    로그인
                                </CustomText>
                            </Pressable>
                            <Pressable
                                onPress={registerHandler}
                                style={styles.button}
                            >
                                <CustomText style={styles.buttonText}>
                                    회원가입
                                </CustomText>
                            </Pressable>
                        </View>
                        <View>
                            <Pressable>
                                <CustomText
                                    style={[
                                        styles.buttonText,
                                        {
                                            fontSize: 14,
                                            fontWeight: "400",
                                            color: "#F3F5F7",
                                            marginTop: 16,
                                        },
                                    ]}
                                >
                                    게스트로 이용하기
                                </CustomText>
                            </Pressable>
                        </View>
                    </View>

                    <MakingDiaryModal />
                    <LoginModal />
                    <RegisterModal
                        onClose={() => setRegisterModalVisible(false)}
                    />
                </ImageBackground>
            </CalendarContext.Provider>
        </ModalContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 460,
    },
    textContainer: {
        marginTop: 100,
        marginVertical: 24,
        justifyContent: "center",
    },
    text: {
        fontWeight: 700,
        fontSize: 28,
        lineHeight: 33.6,
        letterSpacing: -1.44,
        color: "#FEFEFE",
        textAlign: "left",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8,
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "space-around",
        gap: 16,
        width: "100%",
    },
    button: {
        backgroundColor: "#34495E",
        width: 256,
        height: 56,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    testbutton: {
        backgroundColor: "#34495E",
        width: 100,
        height: 26,
        borderRadius: 100,
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
    // 로딩 화면 스타일 추가
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF7F2",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#34495E",
        fontWeight: "500",
    },
    modalContent: {
        backgroundColor: "#FFF7F2",
        width: 345,
        height: 730,
        borderRadius: 24,
        alignItems: "center",
    },
});
