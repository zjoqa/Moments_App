import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "../firebase"; // Firebase 인증 모듈 import
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface RegisterModalProps {
    isVisible: boolean;
    onClose: () => void;
    // authInstance?: any; ← 이 props 제거
}

// 에러 메시지 상수 분리
const ERROR_MESSAGES = {
    EMAIL_REQUIRED: "이메일을 입력해주세요.",
    PASSWORD_LENGTH: "비밀번호는 6자 이상이어야 합니다.",
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    USERNAME_REQUIRED: "사용자명을 입력해주세요.",
    INVALID_EMAIL: "올바른 이메일 형식이 아닙니다.",
    EMAIL_ALREADY_IN_USE: "이미 사용 중인 이메일입니다.", // 추가
    WEAK_PASSWORD: "비밀번호가 너무 약합니다.",
    NETWORK_REQUEST_FAILED: "네트워크 연결을 확인해주세요.",
    UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
};

export default function RegisterModal({
    isVisible,
    onClose,
}: RegisterModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    // Firebase 에러 코드를 한국어 메시지로 변환하는 함수
    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case "auth/email-already-in-use":
                return ERROR_MESSAGES.EMAIL_ALREADY_IN_USE;
            case "auth/weak-password":
                return ERROR_MESSAGES.WEAK_PASSWORD;
            case "auth/invalid-email":
                return ERROR_MESSAGES.INVALID_EMAIL;
            case "auth/network-request-failed":
                return ERROR_MESSAGES.NETWORK_REQUEST_FAILED;
            default:
                return ERROR_MESSAGES.UNKNOWN_ERROR;
        }
    };
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

        if (password.length < 6) {
            setError(ERROR_MESSAGES.PASSWORD_LENGTH);
            return false;
        }

        if (password !== confirmPassword) {
            setError(ERROR_MESSAGES.PASSWORD_MISMATCH);
            return false;
        }

        if (!username.trim()) {
            setError(ERROR_MESSAGES.USERNAME_REQUIRED);
            return false;
        }

        return true;
    };

    const handleRegister = () => {
        setError(""); // 로그인 시도 전 에러 초기화

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // updateProfile을 user 객체에서 직접 호출
                return updateProfile(user, {
                    displayName: username,
                });
            })
            .then(() => {
                onClose(); // 모달만 닫기
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error.code);
                setError(errorMessage);
            });
    };

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
        } else {
            setError("");
        }
    }, [confirmPassword]);

    return (
        <Modal
            isVisible={isVisible}
            backdropColor="black"
            backdropOpacity={0.25}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={onClose}
        >
            <View style={styles.modal}>
                <Pressable onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#E17055" />
                </Pressable>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>회원가입</Text>
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
                        <TextInput
                            placeholder="비밀번호 확인"
                            secureTextEntry
                            style={[styles.input]}
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setError(""); // 입력 시 에러 초기화
                            }}
                        />
                        <TextInput
                            placeholder="사용자 이름"
                            style={styles.input}
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError(""); // 입력 시 에러 초기화
                            }}
                        />
                        <Pressable
                            onPress={handleRegister}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>회원가입</Text>
                        </Pressable>
                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}
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
        fontSize: 32,
        lineHeight: 48,
        letterSpacing: -1.44,
        fontWeight: "700",
        textAlign: "left",
        color: "#E17055",
    },
    formContainer: {
        justifyContent: "center",
        marginTop: 45,
        gap: 24,
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
        marginTop: 10,
        alignSelf: "flex-end",
        padding: 8,
    },
    findPasswordText: {
        color: "#E17055",
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: "#E17055",
        borderRadius: 100,
        width: 300,
        height: 65,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
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
    errorContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 14,
        color: "red",
    },
    inputError: {
        borderWidth: 1,
        borderColor: "#FF6B6B", // 빨간색 테두리
    },
});
