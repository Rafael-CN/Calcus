import { useContext, useEffect, useRef } from "react"; // Removed duplicate useState import
import { Animated, StyleSheet, Text, Vibration, View, Dimensions } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import { TaskContext } from "../contexts/TaskContext";
import Entypo from "@expo/vector-icons/Entypo";
import ColorTransition from "../components/ColorTransition"; // Visual effect for theme change

/**
 * Result Component
 * 
 * Displays the current calculation input (`task`) and the last result (`lastTask`).
 * Includes a button to trigger theme changes.
 * Animates the display text when a new result is calculated.
 */
export default function Result() {
	// --- Context Hooks ---
	const { theme, alternateTheme, getAnimation } = useContext(ThemeContext);
	const { task, didTask, lastTask } = useContext(TaskContext);

	// --- Animations Setup ---
	// Animated value for fading in the result text
	const fadeAnim = useRef(new Animated.Value(1)).current; 
	// Retrieve the 'resultUpdate' animation function from the current theme (e.g., FadeIn)
	const resultUpdateAnimation = getAnimation('resultUpdate'); 

	// Effect to trigger the fade animation when `didTask` (a calculation was performed) changes.
	useEffect(() => {
		if (didTask && resultUpdateAnimation) {
			resultUpdateAnimation(fadeAnim); // Apply animation (e.g., fade in the new result)
		}
	}, [didTask, resultUpdateAnimation, fadeAnim]);

	// --- Responsive Sizing ---
	const screenHeight = Dimensions.get("window").height;
	const screenWidth = Dimensions.get("window").width;

	// --- Styles ---
	// Styles are dynamically created based on the current theme and screen dimensions.
	const styles = StyleSheet.create({
		topSection: { // Container for the entire result display area
			width: "100%",
			height: screenHeight * 0.35,      // 35% of screen height
			marginBottom: screenWidth * 0.02, // Responsive margin
			justifyContent: "flex-end",       // Align text to the bottom
			backgroundColor: theme.display.background, // Background from theme
			// Apply border radius, ensuring theme.borderRadius is a number
			borderBottomLeftRadius: typeof theme.borderRadius === 'number' ? theme.borderRadius * 1.5 : 30,
		},
		themeButton: { // Touchable area for changing the theme
			position: "absolute",
			top: screenHeight * 0.05,   // Position from top
			left: screenWidth * 0.03,    // Position from left
			zIndex: 5,                   // Ensure it's above other elements in this section
			padding: screenWidth * 0.04, // Responsive padding
			borderRadius: typeof theme.borderRadius === 'number' ? theme.borderRadius : 30,
		},
		themeIcon: { // Icon (light bulb) for the theme change button
			color: theme.display.color,          // Icon color from theme
			fontSize: screenWidth * 0.07,        // Responsive icon size
			...(theme.display.effect || {}),     // Apply text effects from theme (e.g., textShadow)
		},
		result: { // Container for the current input/result text
			marginHorizontal: screenWidth * 0.05, // Responsive horizontal margin
			marginBottom: screenHeight * 0.02,   // Responsive bottom margin
		},
		lastResult: { // Style for the display of the last calculated result (smaller text above current)
			marginHorizontal: screenWidth * 0.05,
			fontSize: screenWidth * 0.09,        // Responsive font size
			fontWeight: "300",
			textAlign: "right",
			color: theme.display.color,          // Text color from theme
			...(theme.display.effect || {}),     // Apply text effects
		},
		resultText: { // Style for the main display of current input/task
			fontSize: screenWidth * 0.2,         // Large responsive font size
			fontWeight: "300",
			color: theme.display.color,          // Text color from theme
			textAlign: "right",
			...(theme.display.effect || {}),     // Apply text effects
		},
	});

	// Ref for accessing ColorTransition component's methods
	const transitionRef = useRef(); 

	// Handler for theme change button press
	const handleThemeChange = () => {
		if (!transitionRef.current || !transitionRef.current.available) return; // Check if transition is available
		transitionRef.current.doEffect(); // Trigger color transition animation
		Vibration.vibrate(150);           // Haptic feedback

		// Delay theme change to allow transition animation to be visible
		setTimeout(() => {
			alternateTheme();
		}, 250); 
	};

	return (
		<View style={styles.topSection}>
			{/* Component that handles the animated background color wipe during theme change */}
			<ColorTransition ref={transitionRef} />

			{/* Theme change button */}
			<Animated.View
				style={styles.themeButton}
				onTouchStart={handleThemeChange} // Using onTouchStart for responsiveness
			>
				<Entypo
					name="light-bulb" // Icon for theme switch
					style={styles.themeIcon} 
				/>
			</Animated.View>

			{/* Display for the last calculated result (e.g., "Ans = 123") */}
			<View style={{ opacity: 0.6 }}> {/* Slightly transparent */}
				<Animated.Text
					style={[styles.lastResult, { opacity: fadeAnim }]} // Apply fade animation
					adjustsFontSizeToFit={true} // Scale font to fit if text is too long
					numberOfLines={1}           // Ensure it stays on one line
				>
					{lastTask}
				</Animated.Text>
			</View>

			{/* Display for the current input or result */}
			<Animated.View style={[styles.result, { opacity: fadeAnim }]}>
				<Text
					style={styles.resultText}
					adjustsFontSizeToFit={true}
					numberOfLines={1}
				>
					{task}
				</Text>
			</Animated.View>
		</View>
	);
}
