const isOperation = (e) => {
	return ["×", "÷", "+", "−", "^"].includes(e);
};

const isSpecial = (e) => {
	return ["×", "÷", "+", "−", ",", "^"].includes(e);
};

const toOperation = (e) => {
	e = e.toString();
	e = e.replaceAll("×", "*");
	e = e.replaceAll("÷", "/");
	e = e.replaceAll("−", "-");
	e = e.replaceAll(",", ".");
	// e = e.replaceAll("^", "**"); // Let expr-eval handle '^' directly or use Math.pow if necessary
	// For now, assume expr-eval handles '^' as power. If not, this was the source of "unexpected TOP: *"
	return e;
};

const hasOperation = (e) => {
	return (
		e.includes("×") ||
		e.includes("÷") ||
		e.includes("+") ||
		e.includes("−") ||
		e.includes("^")
	);
};

const toDisplay = (e) => {
	let s = e.toString();
	s = s.replaceAll(".", ",");
	if (s.startsWith("-")) {
		s = "−" + s.substring(1);
	}
	return s;
};

export { isOperation, isSpecial, toOperation, toDisplay, hasOperation };
