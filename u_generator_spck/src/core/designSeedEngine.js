class DesignSeedEngine {
    static palettes = {
        corporate: { primary: "1F4E78", secondary: "595959", accent: "41719C", text: "000000", bg: "FFFFFF" },
        creative: { primary: "6B4226", secondary: "D9822B", accent: "8C6239", text: "2C2C2C", bg: "FDFBF7" },
        modern: { primary: "2563EB", secondary: "64748B", accent: "3B82F6", text: "0F172A", bg: "F8FAFC" }
    };

    static getPalette(themeName = "corporate") {
        return this.palettes[themeName] || this.palettes["corporate"];
    }
}

module.exports = DesignSeedEngine;
