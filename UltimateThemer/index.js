const { storage } = revenge.plugins;
const { React } = revenge.common;
const { findByProps } = revenge.metro;

const THEME_ID = "ultimate-themer-styles";

const DEFAULT_COLORS = {
    background: "#36393f",
    serverList: "#202225",
    channels: "#2f3136",
    text: "#ffffff",
    accent: "#5865f2"
};

// ============================================
// GESTION DU THÈME
// ============================================

function generateCSS(colors) {
    return `
        :root {
            --background-primary: ${colors.background} !important;
            --background-secondary: ${colors.channels} !important;
            --background-tertiary: ${colors.serverList} !important;
            --header-primary: ${colors.text} !important;
            --text-normal: ${colors.text} !important;
            --brand-experiment: ${colors.accent} !important;
        }
    `;
}

function applyTheme() {
    const colors = storage.colors || DEFAULT_COLORS;
    const css = generateCSS(colors);
    
    if (window.revenge?.styles) {
        window.revenge.styles.inject(THEME_ID, css);
    }
}

function removeTheme() {
    if (window.revenge?.styles) {
        window.revenge.styles.uninject(THEME_ID);
    }
}

// ============================================
// COMPOSANT DE CONFIGURATION
// ============================================

function ColorInput({ label, colorKey, currentValue, onUpdate }) {
    return React.createElement(
        "div",
        { style: { marginBottom: 15 } },
        React.createElement(
            "label",
            { style: { 
                display: "block",
                color: "#b5bac1", 
                marginBottom: 5, 
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
            }},
            label
        ),
        React.createElement("input", {
            type: "text",
            style: { 
                width: "100%",
                backgroundColor: "#1e1f22", 
                color: "white", 
                padding: 10, 
                borderRadius: 8,
                border: "1px solid #313338",
                fontSize: 14,
                fontFamily: "monospace"
            },
            value: currentValue,
            onChange: (e) => onUpdate(colorKey, e.target.value),
            placeholder: DEFAULT_COLORS[colorKey]
        })
    );
}

function Settings() {
    const [colors, setColors] = React.useState(() => 
        storage.colors || { ...DEFAULT_COLORS }
    );

    const handleColorUpdate = React.useCallback((key, value) => {
        const newColors = { ...colors, [key]: value };
        setColors(newColors);
        storage.colors = newColors;
        applyTheme();
    }, [colors]);

    const handleReset = React.useCallback(() => {
        setColors({ ...DEFAULT_COLORS });
        storage.colors = { ...DEFAULT_COLORS };
        applyTheme();
    }, []);

    return React.createElement(
        "div",
        { style: { 
            padding: 20, 
            backgroundColor: "#1e1f22",
            minHeight: "100vh"
        }},
        
        // Header
        React.createElement(
            "div",
            { style: { marginBottom: 30 }},
            React.createElement(
                "h1",
                { style: { 
                    color: "white", 
                    fontSize: 24, 
                    fontWeight: "bold",
                    marginBottom: 8
                }},
                "Ultimate Themer"
            ),
            React.createElement(
                "p",
                { style: { 
                    color: "#b5bac1",
                    fontSize: 14
                }},
                "Personnalise les couleurs de ton Discord"
            )
        ),

        // Inputs de couleurs
        React.createElement(
            "div",
            { style: { marginBottom: 20 }},
            React.createElement(ColorInput, {
                label: "Fond principal",
                colorKey: "background",
                currentValue: colors.background,
                onUpdate: handleColorUpdate
            }),
            React.createElement(ColorInput, {
                label: "Liste des serveurs",
                colorKey: "serverList",
                currentValue: colors.serverList,
                onUpdate: handleColorUpdate
            }),
            React.createElement(ColorInput, {
                label: "Liste des salons",
                colorKey: "channels",
                currentValue: colors.channels,
                onUpdate: handleColorUpdate
            }),
            React.createElement(ColorInput, {
                label: "Texte",
                colorKey: "text",
                currentValue: colors.text,
                onUpdate: handleColorUpdate
            }),
            React.createElement(ColorInput, {
                label: "Couleur d'accent",
                colorKey: "accent",
                currentValue: colors.accent,
                onUpdate: handleColorUpdate
            })
        ),

        // Bouton reset
        React.createElement(
            "button",
            {
                onClick: handleReset,
                style: {
                    backgroundColor: "#5865f2",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                }
            },
            "Réinitialiser les couleurs"
        )
    );
}

// ============================================
// EXPORT DU PLUGIN
// ============================================

module.exports = {
    onLoad() {
        if (!storage.colors) {
            storage.colors = { ...DEFAULT_COLORS };
        }
        applyTheme();
    },

    onUnload() {
        removeTheme();
    },

    settings: Settings
};
