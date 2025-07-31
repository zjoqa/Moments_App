import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="loginPage" />
            <Stack.Screen name="(main)" />
        </Stack>
    );
}
