import {
    View,
    Text,
    Pressable,
    TextInput,
    StyleSheet,
    Image,
} from "react-native";
import Modal from "react-native-modal";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Firebase 인증 모듈 import
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface MakingDiaryModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function MakingDiaryModal({
    isVisible,
    onClose,
}: MakingDiaryModalProps) {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.25}
            animationIn="fadeIn"
            animationOut="fadeOut"
        >
            <View>
                <Text>다이어리 작성 모달</Text>
            </View>
        </Modal>
    );
}
