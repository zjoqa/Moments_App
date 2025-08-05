import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import CustomText from "@/CustomText";

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

    const addMoment = () => {
        router.push("/addMoment");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerText}>MOMENTS</CustomText>
                <View style={styles.line}></View>
            </View>
            <View style={styles.body}>
                <View
                    style={{
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 83,
                    }}
                >
                    <View>
                        <CustomText style={styles.subtitle}>
                            내가 머물렀던 시간
                        </CustomText>
                        <Pressable></Pressable>
                        <Pressable style={styles.addButton} onPress={addMoment}>
                            <Ionicons
                                name="camera"
                                size={24}
                                color="#34495E"
                                style={{ marginBottom: 11 }}
                            />
                            <CustomText style={styles.bodyText}>
                                특별한 순간의 사진을 기록해주세요!
                            </CustomText>
                        </Pressable>
                    </View>
                    <View>
                        <CustomText style={styles.subtitle}>
                            내가 머물렀던 마음
                        </CustomText>
                        <Pressable style={styles.addButton} onPress={addMoment}>
                            <Ionicons
                                name="pencil-outline"
                                size={24}
                                color="#34495E"
                                style={{ marginBottom: 11 }}
                            />
                            <CustomText style={styles.bodyText}>
                                특별한 순간의 사진을 기록해주세요!
                            </CustomText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F8F6F3",
        flex: 1,
    },
    header: {
        backgroundColor: "#F8F6F3",
        justifyContent: "center",
        alignItems: "center",
    },
    line: {
        width: "100%",
        height: 0.5,
        backgroundColor: "#797979",
        marginVertical: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },

    body: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 24,
        paddingTop: 40,
    },

    addButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 342,
        height: 180,
        backgroundColor: "#FEFEFE",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },

    subtitle: {
        fontSize: 24,
        lineHeight: 30,
        marginBottom: 24,
        fontWeight: "bold",
        color: "#34495E",
    },

    bodyText: {
        fontSize: 12,
        lineHeight: 18,
        color: "#6B7280",
    },
});
