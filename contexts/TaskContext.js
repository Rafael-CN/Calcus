import { createContext, useState } from "react";
import {
	hasOperation,
	isSpecial, // isOperation is not used directly in this file anymore
	toDisplay,
	toOperation,
} from "../utils/Utils";
import { Parser } from "expr-eval"; // Import Parser from expr-eval

export const TaskContext = createContext();
export const TaskContextProvider = ({ children }) => {
	const [task, setTask] = useState("0");
	const [didTask, setDidTask] = useState(false);
	const [lastTask, setLastTask] = useState("");

	const resetTask = () => {
		setTask("0");
		setLastTask("");
		setDidTask(false);
	};

	const removeLastDigit = () => {
		setTask(task.length > 1 ? task.slice(0, -1) : "0");
		setDidTask(false);
	};

	const repeatTask = () => {
		const split = lastTask.split(/[×÷+−^]+/);
		const lastNumber = split[split.length - 1];

		const repeatTask =
			lastTask[lastTask.length - (lastNumber.length + 1)] + lastNumber;

		return task + repeatTask;
	};

	const doTask = () => {
		let mainTask = task;
		if (didTask && hasOperation(lastTask)) mainTask = repeatTask();

		setLastTask(mainTask);

		let evalString = mainTask;
		evalString = toOperation(evalString);

		try {
			// Use expr-eval Parser
			const parser = new Parser();
			const expr = parser.parse(evalString);
			const result = expr.evaluate(); // No need for context object {} if no variables

			// Check for NaN or Infinity, which can result from operations like 0/0 or 1/0
			if (isNaN(result) || !isFinite(result)) {
				setTask("Error"); // Or "NaN", "Infinity", "Division by zero"
			} else {
				setTask(toDisplay(String(result))); // Ensure result is string before toDisplay
			}
		} catch (e) {
			// Catch errors from parser.parse (e.g., syntax error) or expr.evaluate()
			console.error("Calculation error:", e.message);
			setTask("Error"); // Display a generic error message
		}

		setDidTask(true);
	};

	const addDigit = (e) => {
		const newDigit = e.toString();
		let newTask = task + newDigit;

		// If current task is "0" or calculation was just done, and new digit is a number, start new task
		if ((task === "0" || didTask) && !isNaN(parseFloat(newDigit)) && isFinite(newDigit)) {
			newTask = newDigit;
		} 
		// If last char in task and new digit are both special characters (operators, comma)
		// replace the last special character with the new one.
		else if (isSpecial(task[task.length - 1]) && isSpecial(newDigit)) {
			// Allow specific sequences like '*-' or '/-' (for negative numbers)
			// This logic might need to be more sophisticated depending on desired input behavior
			if (newDigit === '-' && (task.endsWith('*') || task.endsWith('/'))) {
				// Allow expressions like 2*-3 or 10/-2
			} else {
				newTask = task.slice(0, -1) + newDigit;
			}
		}
		// Handle comma input: only one comma per number segment
		else if (newDigit === ",") {
			const segments = task.split(/[×÷+−^]+/);
			const currentNumberSegment = segments[segments.length - 1];
			if (currentNumberSegment.includes(",")) {
				newTask = task; // Do not add another comma if one already exists in the current number
			}
		}

		setDidTask(false);
		setTask(newTask);
	};

	return (
		<TaskContext.Provider
			value={{
				task,
				didTask,
				lastTask,
				resetTask,
				removeLastDigit,
				doTask,
				addDigit,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};
