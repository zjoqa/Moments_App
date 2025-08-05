import {
    View,
    Pressable,
    StyleSheet,
    TextInput,
    Image,
    Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomText from "@/CustomText";
import { use, useEffect, useState } from "react";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function addMoment() {
    const router = useRouter();

    interface MomentData {
        title: string;
        content: string;
        location: string | null;
        userId: string | undefined;
    }

    const [data, setData] = useState<MomentData>({
        title: "",
        content: "",
        location: null,
        userId: auth.currentUser?.uid,
    });

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        };
        return date.toLocaleDateString("en-US", options);
    };

    const [canSave, setCanSave] = useState(false);
    const [titleText, setTitleText] = useState("");
    const [contentText, setContentText] = useState("");

    const [location, setLocation] = useState<string | null>("");
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const momentsdata: MomentData = {
            title: titleText,
            content: contentText,
            location: location,
            userId: auth.currentUser?.uid,
        };
        setData(momentsdata);
    }, [titleText, contentText, location, image]);

    const saveData = async () => {
        if (!canSave) {
            Alert.alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("로그인이 필요합니다.");
                router.push("../loginPage");
                return;
            }

            await addDoc(collection(db, "moments"), data);
        } catch (error) {
            console.error("Error saving data:", error);
            Alert.alert("저장 실패", "데이터 저장 중 오류가 발생했습니다.");
        }
    };

    const getLocation = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync(); // 위치 권한 요청
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            // 현재 위치 가져오기
            const location = await Location.getCurrentPositionAsync({});
            // Reverse Geocoding으로 도시와 국가 가져오기
            const [geoData] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (geoData) {
                // 항상 영어로 표시
                const formattedLocation = `${geoData.isoCountryCode}.${geoData.city}`;
                console.log("Formatted Location:", formattedLocation);
                setLocation(formattedLocation); // 상태에 저장
            } else {
                console.error("Unable to fetch geolocation data");
            }
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    const showDeleteAlert = () => {
        Alert.alert(
            "사진 삭제",
            "사진을 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "삭제",
                    onPress: () => {
                        setImage(null); // 이미지 상태 초기화
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true } // Alert를 취소 가능하게 설정
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // 선택한 이미지 URI를 상태에 저장
            console.log("Selected Image URI:", result.assets[0].uri);
        }
    };

    useEffect(() => {
        // 제목과 내용이 모두 입력되었는지 확인하여 저장 가능 여부 설정
        if (titleText.trim() && contentText.trim()) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [titleText, contentText]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6F3" }}>
            <View style={styles.header}>
                <View style={styles.buttonContainer}>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 8,
                            marginLeft: 24,
                        }}
                    >
                        <Pressable
                            onPress={getLocation}
                            style={[
                                styles.addButton,
                                { backgroundColor: "#E0E0E5" },
                            ]}
                        >
                            <Ionicons
                                name="location-outline"
                                size={16}
                                color="#34495E"
                                style={{ marginRight: 5 }}
                            />
                            <CustomText
                                style={[
                                    styles.addButtonText,
                                    { color: "#34495E" },
                                ]}
                            >
                                위치 추가하기
                            </CustomText>
                        </Pressable>
                        <Pressable style={styles.addButton} onPress={pickImage}>
                            <Ionicons
                                name="camera"
                                size={16}
                                color="#FFFFFF"
                                style={{ marginRight: 5 }}
                            />
                            <CustomText style={styles.addButtonText}>
                                사진 추가하기
                            </CustomText>
                        </Pressable>
                    </View>
                    <Pressable
                        onPress={saveData}
                        style={{
                            marginLeft: 46,
                            marginRight: 24,
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <CustomText
                            style={[
                                styles.addButtonText,
                                {
                                    color: canSave ? "#34495E" : "#B0B0B0",
                                    fontSize: 17,
                                    lineHeight: 24,
                                },
                            ]}
                        >
                            하루 끝내기
                        </CustomText>
                    </Pressable>
                </View>
                <View style={styles.dateContainer}>
                    <CustomText style={styles.text}>
                        {formatDate(Date.now())}
                    </CustomText>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        {location ? (
                            <Ionicons
                                name="location-outline"
                                size={15}
                                color="#797979"
                                style={{ marginRight: 4 }}
                            />
                        ) : null}
                        <CustomText
                            style={[
                                styles.text,
                                {
                                    fontSize: 15,
                                    lineHeight: 21.6,
                                    letterSpacing: -0.48,
                                    fontWeight: "500",
                                },
                            ]}
                        >
                            {location || ""}
                        </CustomText>
                    </View>
                </View>
                <View
                    style={{
                        paddingTop: 14,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingBottom: 14,
                    }}
                >
                    <TextInput
                        placeholder="제목을 입력하세요"
                        value={titleText}
                        onChangeText={setTitleText}
                        style={styles.titleInput}
                    />
                </View>
                <View style={styles.line} />
                <View style={styles.body}>
                    {image ? (
                        <>
                            <Pressable onLongPress={showDeleteAlert}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: "100%", height: 353 }}
                                    resizeMode="center"
                                />
                            </Pressable>
                        </>
                    ) : null}
                    <TextInput
                        placeholder="내용을 입력하세요"
                        value={contentText}
                        onChangeText={setContentText}
                        multiline={true} // 여러 줄 입력 가능
                        textAlignVertical="top" // 텍스트를 상단 정렬
                        style={styles.contentInput}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "#F8F6F3",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        paddingTop: 34,
    },
    addButton: {
        flexDirection: "row",
        width: 105,
        height: 28,
        backgroundColor: "#34495E",
        borderRadius: 4,
        justifyContent: "center",
        padding: 5,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
    },

    line: {
        width: "100%",
        height: 0.5,
        backgroundColor: "#797979",
    },
    dateContainer: {
        marginTop: 34,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
        color: "#797979",
    },
    titleInput: {
        fontSize: 24,
        fontFamily: "Pretendard",
        fontWeight: "600",
        lineHeight: 36,
        color: "#34495E",
    },
    body: {
        flex: 1,
        width: "100%",
        height: "100%",
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    contentInput: {
        fontSize: 16,
        textAlignVertical: "top",
        fontFamily: "Pretendard",
        fontWeight: "400",
        lineHeight: 24,
        color: "#34495E",
    },
});
