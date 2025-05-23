import * as NavigationBar from "expo-navigation-bar";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Result from "./components/Result";
import Digit from "./components/Digit";

import { TaskContext } from "./contexts/TaskContext";
import { useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import { AntDesign } from "@expo/vector-icons";

// Main application component: Calculator
export default function Calculator() {
	// Retrieve current theme and task-related functions from context
	const { theme } = useContext(ThemeContext);
	const { resetTask, removeLastDigit, doTask, addDigit } = useContext(TaskContext); // Added addDigit for ^

	// Set navigation bar color to match the current theme's background
	NavigationBar.setBackgroundColorAsync(theme.background);

	// Define styles for the Calculator layout
	const styles = StyleSheet.create({
		container: {
			flex: 1, // Take up all available screen space
			backgroundColor: theme.background,
			alignItems: "center",
			justifyContent: "flex-end",
			paddingBottom: "2%", // Replaced fixed padding with percentage
		},

		mainSection: {
			display: "flex",
			flexDirection: "row",
			zIndex: -1, // Ensure main section is behind any potential modals/pop-ups
			width: "100%", 
			justifyContent: "center", 
		},
		// Section for numeric input and top row of special characters (C, E, ^)
		leftSection: { 
			flex: 3, 
			flexDirection: "column",
		},
		// Section for arithmetic operators on the right side
		rightSection: { 
			flex: 1, 
			flexDirection: "column",
		},
		// Represents a single row of digits/buttons
		numberLine: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around", 
		},
	});

	return (
		<View style={styles.container}>
			{/* Status bar configuration */}
			<StatusBar style="light" />

			{/* Result display component */}
			<Result />

			{/* Main calculator interface area */}
			<View style={styles.mainSection}>
				{/* Left part: numbers and special top buttons */}
				<View style={styles.leftSection}>
					{/* Top row: C, E, ^ */}
					<View style={styles.numberLine}>
						<Digit text="C" buttonStyle={theme.buttons.inverted} onPress={resetTask} />
						<Digit text="E" buttonStyle={theme.buttons.inverted} onPress={removeLastDigit} />
						<Digit
							text={<AntDesign name="up" size={24} />} // Icon for power/exponent
							value="^" // Actual value to be processed
							buttonStyle={theme.buttons.inverted}
							onPress={() => addDigit("^")} // Ensure '^' is handled by addDigit
						/>
					</View>

					{/* Number pad section */}
					{[
						[7, 8, 9], // Row 1
						[4, 5, 6], // Row 2
						[1, 2, 3], // Row 3
					].map((numberRow, rowIndex) => (
						<View style={styles.numberLine} key={`row-${rowIndex}`}>
							{numberRow.map((number) => (
								<Digit 
									key={number} 
									text={String(number)} // Ensure text is always string
									buttonStyle={theme.buttons.default} 
								/>
							))}
						</View>
					))}

					{/* Bottom row: 0 (double size) and comma */}
					<View style={styles.numberLine}>
						<Digit text="0" size={2} buttonStyle={theme.buttons.default} />
						<Digit text="," value="." buttonStyle={theme.buttons.default} /> {/* Assuming comma should input a period for calculations */}
					</View>
				</View>

				{/* Right part: operators */}
				<View style={styles.rightSection}>
					<Digit text="÷" value="/" buttonStyle={theme.buttons.inverted} />
					<Digit text="×" value="*" buttonStyle={theme.buttons.inverted} />
					<Digit text="+" value="+" buttonStyle={theme.buttons.inverted} />
					<Digit text="−" value="-" buttonStyle={theme.buttons.inverted} />
					<Digit text="=" buttonStyle={theme.buttons.inverted} onPress={doTask} />
				</View>
			</View>
		</View>
	);
}
