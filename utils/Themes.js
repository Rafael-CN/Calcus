// Default animations - these can be overridden by themes
// For now, we'll just reference them by name, assuming they are imported where needed.
// In a real scenario, you might import the actual functions from Animations.js here.
const defaultAnimations = {
	digitPress: "Pulse", // Placeholder for actual Pulse function
	highlight: "Highlight", // Placeholder for actual Highlight function
	resultUpdate: "FadeIn", // Placeholder for actual FadeIn function
};

const GrayTheme = {
	name: "Gray",
	background: "#4E505F",
	display: {
		background: "#3B3C4A",
		color: "#B0B1BE",
		effect: {}, // No special effect
	},
	buttons: {
		default: {
			fontColor: "#B0B1BE",
			backgroundColor: "#3B3C4A",
			highlightColor: "#474859",
			effect: {},
		},
		inverted: {
			fontColor: "#3B3C4A",
			backgroundColor: "#B0B1BE",
			highlightColor: "#A2A3B3",
			effect: {},
		},
	},
	borderRadius: 30,
	animations: { ...defaultAnimations }, // Uses all default animations
};

const PurpleTheme = {
	name: "Purple",
	background: "#F0E8F7",
	display: {
		background: "#D3C1E2",
		color: "#604E73",
		effect: {},
	},
	buttons: {
		default: {
			fontColor: "#D3C1E2",
			backgroundColor: "#604E73",
			highlightColor: "#6C5881",
			effect: {},
		},
		inverted: {
			fontColor: "#604E73",
			backgroundColor: "#D3C1E2",
			highlightColor: "#C4ACD8",
			effect: {},
		},
	},
	borderRadius: 50,
	animations: { ...defaultAnimations },
};

const GreenTheme = {
	name: "Green",
	background: "#B8D5CA",
	display: {
		background: "#769E92",
		color: "#B8D5CA",
		effect: {},
	},
	buttons: {
		default: {
			fontColor: "#B8D5CA",
			backgroundColor: "#187C5E",
			highlightColor: "#1C926F",
			effect: {},
		},
		inverted: {
			fontColor: "#B8D5CA",
			backgroundColor: "#769E92",
			highlightColor: "#6A9589",
			effect: {},
		},
	},
	borderRadius: 20,
	animations: { ...defaultAnimations },
};

const IronManTheme = {
	name: "IronMan",
	background: "#6C1211",
	display: {
		background: "#EBCC4F",
		color: "#6C1211",
		effect: {},
	},
	buttons: {
		default: {
			fontColor: "#F9E180",
			backgroundColor: "#AE1B1B",
			highlightColor: "#FFF", // Assuming white highlight
			effect: {},
		},
		inverted: {
			fontColor: "#6C1211",
			backgroundColor: "#EBCC4F",
			highlightColor: "#FFF", // Assuming white highlight
			effect: {},
		},
	},
	borderRadius: 18,
	animations: { ...defaultAnimations },
};

const NeonTheme = {
	name: "Neon",
	background: "#181F2A",
	display: {
		background: "#263346",
		color: "#01FFF4",
		effect: { // Generalized display effect
			textShadowColor: "#4BFFF7",
			textShadowRadius: 15,
			// textShadowOffset: { width: 0, height: 0 }, // Example of more properties
		},
	},
	buttons: {
		default: {
			fontColor: "#FF1178",
			backgroundColor: "#1D2737",
			highlightColor: "#000", // Black highlight
			effect: { // Generalized text effect for default buttons
				textShadowColor: "#FF4193",
				textShadowRadius: 25,
			},
		},
		inverted: {
			fontColor: "#01FFF4",
			backgroundColor: "#263346",
			highlightColor: "#000", // Black highlight
			effect: { // Generalized text effect for inverted buttons
				textShadowColor: "#4BFFF7",
				textShadowRadius: 25,
			},
		},
	},
	borderRadius: 25,
	animations: { // Neon theme could potentially override some animations
		...defaultAnimations,
		// digitPress: (animVal, initVal) => { /* custom neon pulse */ }, // Example
	},
};

export const Themes = [
	GrayTheme,
	PurpleTheme,
	GreenTheme,
	IronManTheme,
	NeonTheme,
];

// Function to get a theme by name, or the first one if name is not found
export const getTheme = (name) => {
	const theme = Themes.find(t => t.name === name);
	return theme || Themes[0];
};

// Default theme to be used initially or if no theme is set
export const defaultTheme = GrayTheme;
