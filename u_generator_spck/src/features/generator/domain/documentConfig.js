class DocumentConfig {
    constructor(title, author, theme = "corporate", sections = []) {
        this.title = title;
        this.author = author;
        this.theme = theme;
        this.sections = sections;
        this.metadata = {};
    }
}

module.exports = DocumentConfig;
