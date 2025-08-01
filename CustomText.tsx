import React from "react";
import { Text as RNText, TextProps } from "react-native";
import { Rect } from "react-native-safe-area-context";

interface CustomTextProps extends TextProps {}

const CustomText: React.FC<CustomTextProps> = ({ style, ...rest }) => {
    const customStyle = {
        fontFamily: "Pretendard-Regular",
        color: "red",
    };

    return <RNText style={[customStyle, style]} {...rest} />;
};

export default CustomText;

// Usage example
// <CustomText style={{ fontSize: 16 }}>Hello, World!</CustomText>
