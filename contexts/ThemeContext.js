import { createContext, useState, useEffect } from "react";
import { Themes, defaultTheme, getTheme } from "../utils/Themes";
import * as DefaultAnimations from "../utils/Animations"; // Import all as a namespace

export const ThemeContext = createContext();

// Map string names from theme to actual animation functions
const allDefaultAnimations = {
	Pulse: DefaultAnimations.Pulse,
	FadeIn: DefaultAnimations.FadeIn,
	Highlight: DefaultAnimations.Highlight,
	// Add other default animations if they exist
};

export const ThemeContextProvider = ({ children }) => {
	const [currentTheme, setCurrentTheme] = useState(defaultTheme);
	const [themeName, setThemeName] = useState(defaultTheme.name);

	// Effect to update theme when themeName changes (e.g., loaded from storage)
	useEffect(() => {
		const newTheme = getTheme(themeName);
		setCurrentTheme(newTheme);
	}, [themeName]);

	const alternateTheme = () => {
		const currentIndex = Themes.findIndex(t => t.name === currentTheme.name);
		const nextIndex = (currentIndex + 1) % Themes.length;
		setThemeName(Themes[nextIndex].name); // This will trigger the useEffect above
	};

	// Function to get an animation.
	// It looks for the animation in the current theme's animation overrides.
	// If not found, it falls back to the default animation.
	const getAnimation = (animationName) => {
		const themeAnimation = currentTheme.animations && currentTheme.animations[animationName];
		if (typeof themeAnimation === 'function') {
			return themeAnimation;
		}
		// If it's a string, it's a reference to a default animation
		if (typeof themeAnimation === 'string' && allDefaultAnimations[themeAnimation]) {
			return allDefaultAnimations[themeAnimation];
		}
		// Fallback to default if no theme-specific animation
		return allDefaultAnimations[animationName];
	};

	// The 'colors' object is deprecated. Components will access theme properties directly.
	// e.g., currentTheme.buttons.default.backgroundColor

	return (
		<ThemeContext.Provider value={{ 
			theme: currentTheme, // Provide the full current theme object
			// colors object is no longer provided as per new structure
			alternateTheme,
			getAnimation // Provide the function to get animations
		}}>
			{children}
		</ThemeContext.Provider>
	);
};
