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
		Animated.sequence([
			Animated.timing(bgAnim, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false, // Explicitly false for backgroundColor
			}),
			// No delay needed here, the reset should be quick.
			// If issues arise, Animated.delay could be inserted.
			Animated.timing(bgAnim, { // This animation resets the value
				toValue: 0,
				duration: 0, // Instant reset
				useNativeDriver: false, // Explicitly false
			})
		]).start(() => {
			// This callback is for the whole sequence
			setLastBg(nextBg);
			// bgAnim is already reset to 0 by the sequence.
		});
	}, [theme, nextBg]);

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
