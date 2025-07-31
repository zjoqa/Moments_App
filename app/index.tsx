import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function MainPage() {
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const user = await AsyncStorage.getItem("user");
            if (!user) {
                router.replace("/loginPage"); // 로그인 정보가 없으면 로그인 페이지로 이동
            } else {
                router.replace("/(main)/mainPage");
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Loading...</Text>
        </View>
    );
}
