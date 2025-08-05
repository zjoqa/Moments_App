import { Tabs } from "expo-router";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarLabel: "",
                tabBarActiveTintColor: "#34495E", // 활성 상태 색상
                tabBarInactiveTintColor: "#797979", // 비활성 상태 색상
                tabBarStyle: {
                    backgroundColor: "#F8F6F3",
                    height: 80,
                },
            }}
        >
            <Tabs.Screen
                name="mainPage"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="addMoment"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="pencil-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="collectingDiaries"
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
