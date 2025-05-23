import { useContext, useRef, useState } from "react";
import { StyleSheet, Vibration, Animated, Dimensions } from "react-native";
import { TaskContext } from "../contexts/TaskContext";
// Highlight and Pulse are no longer directly imported, will be fetched from ThemeContext
import { ThemeContext } from "../contexts/ThemeContext";

// --- Responsive Sizing ---
const screenWidth = Dimensions.get("window").width;
// Calculate base size for a standard digit button.
// Aims for roughly 4 buttons across the main number pad area, accounting for margins.
// Using 90% of screen width divided by ~4.5 (to allow for margins and slight adjustments).
const baseButtonSize = (screenWidth * 0.9) / 4.5; 
const defaultSize = baseButtonSize; // Standard height and base width for a 1x1 digit
const defaultFontSize = baseButtonSize * 0.4; // Scale font size proportionally to button size

/**
 * Digit Component
 * 
 * Represents a single pressable button in the calculator.
 * It can display text or an icon, handle press events, and animate.
 * Styling is primarily driven by the `buttonStyle` prop, derived from the current theme.
 * 
 * @param {object} props - Component props.
 * @param {string|JSX.Element} props.text - The text or icon to display on the button.
 * @param {string|number} [props.value=null] - The actual value this digit represents (e.g., for operators or if text is different from value). If null, `text` is used.
 * @param {function} [props.onPress=null] - Custom press handler. If null, `addDigit(value || text)` is called.
 * @param {object} props.buttonStyle - Style object from the theme (e.g., `theme.buttons.default`). Defines background, font color, highlight, and text effects.
 * @param {number} [props.size=1] - The span of the button (e.g., size=2 for a double-width button like '0').
 */
export default function Digit({
	text,
	value = null,
	onPress = null,
	buttonStyle, 
	size = 1,
}) {
	const { addDigit } = useContext(TaskContext);
	const { theme, getAnimation } = useContext(ThemeContext);

	// --- Animations Setup ---
	// Animated value for font size (for press effect)
	const fontSizeAnim = useRef(new Animated.Value(defaultFontSize)).current;
	// Animated value for background color (for highlight effect)
	const [bgAnim] = useState(new Animated.Value(0)); // 0 = normal, 1 = highlighted

	// --- Sizing & Styling ---
	const marginH = screenWidth * 0.01; // Responsive horizontal margin
	// Calculate width based on `size` prop (for multi-span buttons like "0")
	// It takes `defaultSize` multiplied by `size`, and adds horizontal margins between spanned cells.
	let width = defaultSize * size + (size > 1 ? marginH * (size - 1) : 0);

	// Defensive check for buttonStyle prop.
	// Components consuming Digit (like Calculator.js) should always pass this.
	if (!buttonStyle) {
		console.warn("Digit component received no buttonStyle. Using fallback.");
		buttonStyle = { // Basic fallback to prevent crashes
			backgroundColor: "#808080", // grey
			highlightColor: "#A9A9A9", // darkgrey
			fontColor: "#FFFFFF", // white
			effect: {},
		};
	}

	// Interpolate background color for press highlight effect
	const bgColor = bgAnim.interpolate({
		inputRange: [0, 1], // 0 = normal, 1 = highlighted
		outputRange: [buttonStyle.backgroundColor, buttonStyle.highlightColor],
	});

	// Define component styles
	const styles = StyleSheet.create({
		number: {
			height: defaultSize,          // Standard height for all buttons
			width: width,                 // Calculated width (can be wider for size > 1)
			marginHorizontal: marginH,    // Responsive horizontal margin
			marginVertical: screenWidth * 0.015, // Responsive vertical margin
			borderRadius: theme.borderRadius, // Use global border radius from theme
			justifyContent: "center",     // Center content (text/icon)
			backgroundColor: bgColor,     // Animated background color for press effect
		},
		numberText: {
			fontSize: defaultFontSize,    // Responsive font size
			fontWeight: "300",
			fontFamily: "Stark",          // Custom font
			color: buttonStyle.fontColor, // Font color from theme's buttonStyle
			textAlign: "center",
			...(buttonStyle.effect || {}), // Apply text effects from theme (e.g., textShadow)
		},
	});
	
	// Retrieve animation functions from theme context, falling back to defaults.
	const pressAnimation = getAnimation('digitPress');   // Animation for font size (e.g., Pulse)
	const highlightAnimation = getAnimation('highlight'); // Animation for background (e.g., Highlight)

	// Default press handler if no custom `onPress` is provided
	const handlePress = () => {
		if (onPress) {
			onPress();
		} else {
			addDigit(String(value !== null ? value : text)); // Ensure value is a string
		}
	};

	return (
		<Animated.View
			style={styles.number} // Apply main button container styles
			onTouchStart={() => {
				Vibration.vibrate(50); // Haptic feedback
				// Trigger themed animations if they exist
				if (pressAnimation) pressAnimation(fontSizeAnim, defaultFontSize);
				if (highlightAnimation) highlightAnimation(bgAnim);

				handlePress(); // Execute press logic
			}}
			onTouchEnd={() => {
				// Could add onTouchEnd animations if needed, e.g., to revert pressAnimation smoothly
			}}
		>
			<Animated.Text
				style={[
					styles.numberText,       // Apply text styles
					{ fontSize: fontSizeAnim }, // Apply animated font size for press effect
				]}
			>
				{text}
			</Animated.Text>
		</Animated.View>
	);
}
