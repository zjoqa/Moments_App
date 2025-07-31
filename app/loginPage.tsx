import {
    View,
    Text,
    ImageBackground,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { use, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { auth } from "../firebase"; // Firebase 인증 모듈 import
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StartPage() {
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const loginHandler = () => {
        setLoginModalVisible(true);
    };

    const registerHandler = () => {
        setRegisterModalVisible(true);
    };

    useEffect(() => {
        const cheackAuthStatus = async () => {
            try {
                const user = await AsyncStorage.getItem("user");
                if (user) {
                    // 사용자가 로그인 상태인 경우 메인 페이지로 이동
                    router.replace("/(main)/mainPage");
                    setIsLoading(false);
                } else {
                    // 사용자가 로그인하지 않은 경우 로딩 완료
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("인증 상태 확인 중 에러 발생:", error);
                setIsLoading(false);
            }
        };
        cheackAuthStatus();
    }, []);

    // 로딩 중일 때 로딩 화면 표시
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E17055" />
                <Text style={styles.loadingText}>인증 상태 확인 중...</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            style={styles.container}
            source={require("../assets/images/startPageImage.jpg")}
        >
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    스쳐가는 순간들을 놓치지 마세요.
                    {"\n"}기억은 이곳에 남아요
                </Text>
            </View>
            <View>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={loginHandler} style={styles.button}>
                        <Text style={styles.buttonText}>로그인</Text>
                    </Pressable>
                    <Pressable
                        onPress={registerHandler}
                        style={[styles.button, { backgroundColor: "#FEFEFE" }]}
                    >
                        <Text style={[styles.buttonText, { color: "#E17055" }]}>
                            회원가입
                        </Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable>
                        <Text
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
                        </Text>
                    </Pressable>
                </View>
            </View>
            <LoginModal
                isVisible={loginModalVisible}
                onClose={() => setLoginModalVisible(false)}
                // authInstance prop 제거 (export된 auth 사용)
            />
            <RegisterModal
                isVisible={registerModalVisible}
                onClose={() => setRegisterModalVisible(false)}
                // authInstance prop 제거 (export된 auth 사용)
            />
        </ImageBackground>
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
        backgroundColor: "#E17055",
        width: 256,
        height: 56,
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
        color: "#E17055",
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
