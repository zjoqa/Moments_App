import { View, Pressable, TextInput, StyleSheet, Image } from "react-native";
import CustomText from "@/CustomText";
import Modal from "react-native-modal";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase"; // Firebase 인증 모듈 import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ModalContext } from "../context/ModalContext"; // ModalContext import
import { collection, getDocs } from "firebase/firestore";

// 로그인용 에러 메시지 상수
const ERROR_MESSAGES = {
    EMAIL_REQUIRED: "이메일을 입력해주세요.",
    PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
    INVALID_EMAIL: "올바른 이메일 형식이 아닙니다.",
    USER_NOT_FOUND: "존재하지 않는 계정입니다.",
    WRONG_PASSWORD: "잘못된 비밀번호입니다.",
    USER_DISABLED: "비활성화된 계정입니다.",
    TOO_MANY_REQUESTS:
        "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
    NETWORK_REQUEST_FAILED: "네트워크 연결을 확인해주세요.",
    UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
};

export default function LoginModal() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onClose = () => {
        setLoginModalVisible(false);
    };

    const modalContext = useContext(ModalContext);
    if (!modalContext) {
        throw new Error("ModalContext가 제공되지 않았습니다.");
    }
    const {
        loginModalVisible,
        setLoginModalVisible,
        setMakingDiaryModalVisible,
    } = modalContext;

    // Firebase 로그인 에러 코드를 한국어 메시지로 변환하는 함수
    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case "auth/user-not-found":
                return ERROR_MESSAGES.USER_NOT_FOUND;
            case "auth/wrong-password":
                return ERROR_MESSAGES.WRONG_PASSWORD;
            case "auth/invalid-email":
                return ERROR_MESSAGES.INVALID_EMAIL;
            case "auth/user-disabled":
                return ERROR_MESSAGES.USER_DISABLED;
            case "auth/too-many-requests":
                return ERROR_MESSAGES.TOO_MANY_REQUESTS;
            case "auth/network-request-failed":
                return ERROR_MESSAGES.NETWORK_REQUEST_FAILED;
            case "auth/invalid-credential":
                return "이메일 또는 비밀번호가 올바르지 않습니다.";
            default:
                return ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    };

    // 로그인용 유효성 검사
    const validateForm = () => {
        if (!email.trim()) {
            setError(ERROR_MESSAGES.EMAIL_REQUIRED);
            return false;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(ERROR_MESSAGES.INVALID_EMAIL);
            return false;
        }

        if (!password.trim()) {
            setError(ERROR_MESSAGES.PASSWORD_REQUIRED);
            return false;
        }

        return true;
    };

    const handleLogin = () => {
        setError("");

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await AsyncStorage.setItem("user", JSON.stringify(user));

                const myTravel = await getDocs(collection(db, "travels"));

                if (myTravel.empty) {
                    setLoginModalVisible(false); // 로그인 모달 닫기
                    setTimeout(() => {
                        setMakingDiaryModalVisible(true); // 다이어리 생성 모달 열기
                    }, 550); // 상태 변경 간 딜레이 추가
                } else {
                    console.log("다이어리 있음, 메인 페이지로 이동");
                    router.replace("/(main)/mainPage");
                    setLoginModalVisible(false); // 로그인 모달 닫기
                }
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error.code);
                console.log("로그인 에러:", error.code);
                setError(errorMessage);
            });
    };

    const findPasswordHandler = () => {
        console.log("비밀번호 찾기 버튼 클릭");
    };

    return (
        <Modal
            isVisible={loginModalVisible}
            backdropColor="black"
            backdropOpacity={0.25}
            animationIn="fadeIn"
            animationOut="fadeOut"
            useNativeDriver={true} // 애니메이션 문제 방지
            onBackdropPress={onClose}
        >
            <View style={styles.modal}>
                <Pressable onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#E17055" />
                </Pressable>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <CustomText style={styles.title}>로그인</CustomText>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            placeholder={"이메일"}
                            style={styles.input}
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError(""); // 입력 시 에러 초기화
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder={"비밀번호"}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError(""); // 입력 시 에러 초기화
                            }}
                        />

                        <Pressable
                            onPress={findPasswordHandler}
                            style={styles.findPasswordButton}
                        >
                            <CustomText style={styles.findPasswordText}>
                                비밀번호 찾기
                            </CustomText>
                        </Pressable>

                        {/* 에러 메시지 - 로그인 버튼 바로 위에 */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <CustomText style={styles.errorText}>
                                    {error}
                                </CustomText>
                            </View>
                        )}

                        <Pressable
                            onPress={handleLogin}
                            style={styles.loginButton}
                        >
                            <CustomText style={styles.loginButtonText}>
                                로그인
                            </CustomText>
                        </Pressable>

                        <CustomText style={styles.orText}>or</CustomText>

                        <View style={styles.socialIconContainer}>
                            <Pressable style={styles.socialButton}>
                                <Image
                                    source={require("@/assets/images/googleLogo.png")}
                                    style={[
                                        styles.socialIcon,
                                        { paddingTop: 10 },
                                    ]}
                                />
                            </Pressable>
                            <Pressable style={styles.socialButton}>
                                <Image
                                    source={require("@/assets/images/appleLogo.png")}
                                    style={[
                                        styles.socialIcon,
                                        { width: 45, height: 45 },
                                    ]}
                                />
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
        width: 348,
        height: 730,
        borderRadius: 24,
        alignSelf: "center",
        position: "relative",
    },
    modalContent: {
        paddingLeft: 24,
        paddingRight: 24,
    },
    header: {
        alignItems: "flex-start",
        paddingTop: 77,
    },
    closeButton: {
        position: "absolute",
        top: 24,
        left: 24,
    },
    title: {
        fontWeight: "700",
        fontSize: 32,
        lineHeight: 48,
        letterSpacing: -1.44,
        textAlign: "left",
        color: "#E17055",
    },
    formContainer: {
        justifyContent: "center",
        marginTop: 24,
        gap: 16,
    },
    input: {
        borderRadius: 100,
        width: 300,
        height: 65,
        fontSize: 16,
        paddingLeft: 24,
        textAlign: "left",
        backgroundColor: "#fff",
    },
    findPasswordButton: {
        alignSelf: "flex-end",
        padding: 8,
        marginTop: -8,
    },
    findPasswordText: {
        color: "#E17055",
        fontSize: 14,
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
    loginButton: {
        backgroundColor: "#E17055",
        borderRadius: 100,
        width: 300,
        height: 65,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
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
});
