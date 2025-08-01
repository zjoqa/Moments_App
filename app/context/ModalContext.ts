import { createContext } from "react";

interface ModalContextType {
    loginModalVisible: boolean;
    registerModalVisible: boolean;
    makingDiaryModalVisible: boolean;
    setMakingDiaryModalVisible: (visible: boolean) => void;
    setLoginModalVisible: (visible: boolean) => void;
    setRegisterModalVisible: (visible: boolean) => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);
