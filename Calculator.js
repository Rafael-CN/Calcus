import * as NavigationBar from "expo-navigation-bar";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import Result from "./components/Result";
import Digit from "./components/Digit";

import { TaskContext } from "./contexts/TaskContext";
import { useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import { AntDesign } from "@expo/vector-icons";

export default function Calculator() {
	const { theme } = useContext(ThemeContext);
	const { resetTask, removeLastDigit, doTask, addDigit } = useContext(TaskContext); 

	NavigationBar.setBackgroundColorAsync(theme.background);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.background,
			alignItems: "center",
			justifyContent: "flex-end",
			paddingBottom: "2%", 
		},

		mainSection: {
			display: "flex",
			flexDirection: "row",
			zIndex: -1, 
			width: "100%",
			justifyContent: "center",
		},
		leftSection: {
			flex: 3,
			flexDirection: "column",
		},
		rightSection: {
			flex: 1,
			flexDirection: "column",
		},
		numberLine: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-around",
		},
	});

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<Result />

			<View style={styles.mainSection}>
				<View style={styles.leftSection}>
					<View style={styles.numberLine}>
						<Digit text="C" buttonStyle={theme.buttons.inverted} onPress={resetTask} />
						<Digit text="E" buttonStyle={theme.buttons.inverted} onPress={removeLastDigit} />
						<Digit
							text={<Text><AntDesign name="up" size={24} /></Text>}
							value="^"
							buttonStyle={theme.buttons.inverted}
							onPress={() => addDigit("^")}
						/>
					</View>

					{[
						[7, 8, 9], 
						[4, 5, 6], 
						[1, 2, 3], 
					].map((numberRow, rowIndex) => (
						<View style={styles.numberLine} key={`row-${rowIndex}`}>
							{numberRow.map((number) => (
								<Digit
									key={number}
									text={String(number)}
									buttonStyle={theme.buttons.default}
								/>
							))}
						</View>
					))}

					<View style={styles.numberLine}>
						<Digit text="0" size={2} buttonStyle={theme.buttons.default} />
						<Digit text="," value="." buttonStyle={theme.buttons.default} />
					</View>
				</View>

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
