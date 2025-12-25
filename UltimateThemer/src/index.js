(() => {
    const { storage } = revenge.plugins;
    const { React } = revenge.common;
    const { findByProps } = revenge.metro;
    
    const { ScrollView, Text, TextInput } = findByProps("ScrollView", "Text", "TextInput");
    const THEME_ID = "ultimate-themer-style";

    function applyTheme() {
        const c = storage.colors || { background: "#36393f", accent: "#5865f2" };
        const css = `:root { --background-primary: ${c.background} !important; --brand-experiment: ${c.accent} !important; }`;
        if (window.revenge?.styles) {
            window.revenge.styles.inject(THEME_ID, css);
        }
    }

    function SettingsPage() {
        const [bg, setBg] = React.useState(storage.colors?.background || "#36393f");
        return React.createElement(ScrollView, { style: { flex: 1, padding: 20 } },
            React.createElement(Text, { style: { color: "white", fontSize: 20, marginBottom: 10 } }, "Réglages du Thème"),
            React.createElement(TextInput, {
                style: { backgroundColor: "#202225", color: "white", padding: 10, borderRadius: 5 },
                value: bg,
                onChangeText: (v) => {
                    setBg(v);
                    storage.colors = { ...storage.colors, background: v };
                    applyTheme();
                },
                placeholder: "#36393f"
            })
        );
    }

    return {
        onLoad: () => applyTheme(),
        onUnload: () => window.revenge?.styles?.uninject(THEME_ID),
        settings: SettingsPage
    };
})();
























































































