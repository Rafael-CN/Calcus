import {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { Animated } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";

const ColorTransition = (props, ref) => {
	const size = 1000; // This might need to be screen width if the animation is to cover the screen

	const [translateXAnim] = useState(new Animated.Value(-size)); // Renamed for clarity
	const { theme } = useContext(ThemeContext);

	const [lastBg, setLastBg] = useState(theme.background);
	const nextBg = theme.background;

	const [bgAnim] = useState(new Animated.Value(0));
	const bgColor = bgAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [lastBg, nextBg],
	});

	useEffect(() => {
		// backgroundColor animation cannot use native driver
		Animated.timing(bgAnim, {
			toValue: 1,
			duration: 250,
			useNativeDriver: false, 
		}).start(() => {
			setLastBg(nextBg);
			Animated.timing(bgAnim, {
				toValue: 0,
				duration: 0,
				useNativeDriver: false,
			}).start();
		});
	}, [theme]);

	useImperativeHandle(ref, () => ({
		doEffect: () => {
			doEffect();
		},
		available: available,
	}));

	const [available, setAvailable] = useState(true);

	const doEffect = () => {
		if (!available) return;

		setAvailable(false);
		Animated.sequence([
			Animated.timing(translateXAnim, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true, // Now using native driver for transform
			}),
			Animated.timing(translateXAnim, {
				toValue: 400, // This value might need to be responsive (e.g. screenWidth)
				duration: 350,
				useNativeDriver: true, // Now using native driver for transform
			}),
			Animated.timing(translateXAnim, {
				toValue: -size, // Reset position off-screen
				duration: 0,
				useNativeDriver: true, // Now using native driver for transform
			}),
		]).start(() => {
			setAvailable(true);
		});
	};

	return (
		<Animated.View
			style={{
				height: 1000,
				width: size,
				backgroundColor: bgColor, // Animated on JS thread
				position: "absolute",
				top: 0,
				// left: 0, // Initial position set to 0 as translateX will handle movement
				transform: [{ translateX: translateXAnim }], // Use translateX for animation
				zIndex: 10,
				borderRadius: 50, // This might need to be size/2 for a circle
			}}
		></Animated.View>
	);
};
export default forwardRef(ColorTransition);
