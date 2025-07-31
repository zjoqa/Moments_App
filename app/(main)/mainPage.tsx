import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { auth } from "../../firebase"; // Firebase 인증 모듈 import
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            await AsyncStorage.removeItem("user"); // 로그아웃 시 사용자 정보 삭제
            router.replace("/loginPage"); // 로그인 페이지로 이동
        } catch (error) {
            console.log("로그아웃 에러:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>메인 페이지</Text>
            <Text style={styles.subtitle}>로그인 성공!</Text>

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>로그아웃</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF7F2",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#E17055",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: "#666",
        marginBottom: 40,
    },
    logoutButton: {
        backgroundColor: "#E17055",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
