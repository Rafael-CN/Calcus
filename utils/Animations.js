import { Animated } from "react-native";

const Pulse = (animationValue, initialValue) => {
	Animated.sequence([
		Animated.timing(animationValue, {
			toValue: initialValue * 0.7,
			duration: 100,
			useNativeDriver: false, // fontSize cannot be animated by native driver
		}),
		Animated.timing(animationValue, {
			toValue: initialValue,
			duration: 100,
			useNativeDriver: false, // fontSize cannot be animated by native driver
		}),
		Animated.timing(animationValue, {
			toValue: initialValue * 1.1,
			duration: 50,
			useNativeDriver: false, // fontSize cannot be animated by native driver
		}),
		Animated.timing(animationValue, {
			toValue: initialValue,
			duration: 200,
			useNativeDriver: false, // fontSize cannot be animated by native driver
		}),
	]).start();
};

// FadeIn animation for opacity - uses native driver
const FadeIn = (animationValue) => {
	Animated.sequence([
		Animated.timing(animationValue, {
			toValue: 0,
			duration: 0,
			useNativeDriver: true, // opacity can be animated by native driver
		}),
		Animated.timing(animationValue, {
			toValue: 1,
			duration: 650,
			useNativeDriver: true, // opacity can be animated by native driver
		}),
	]).start();
};

// Highlight animation for backgroundColor - cannot use native driver
const Highlight = (animationValue) => {
	Animated.sequence([
		Animated.timing(animationValue, {
			toValue: 1,
			duration: 150,
			useNativeDriver: false, // backgroundColor cannot be animated by native driver
		}),
		Animated.timing(animationValue, {
			toValue: 0,
			duration: 150,
			useNativeDriver: false, // backgroundColor cannot be animated by native driver
		}),
	]).start();
};

export { Pulse, FadeIn, Highlight };
