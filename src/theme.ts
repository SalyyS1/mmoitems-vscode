import * as vscode from 'vscode';

const MMOITEMS_KEYWORDS = [
    'type', 'id', 'name', 'lore', 'tier', 'material', 'attack-damage', 'attack-speed',
    'durability', 'enchantments', 'custom-model-data', 'abilities', 'stats', 'gem-stones',
    'soulbound', 'required-class', 'required-level', 'pve-damage', 'pvp-damage',
    'armor', 'defense', 'mana-regeneration', 'cooldown-reduction', 'item-cooldown'
];

// **Màu sắc theo theme Minecraft**
const MMOITEMS_THEME: Record<string, vscode.ThemeColor> = {
    keyword: new vscode.ThemeColor('editor.foreground'), // Màu chính
    number: new vscode.ThemeColor('editor.lineHighlightBackground'), // Màu số liệu
    string: new vscode.ThemeColor('editor.hoverHighlightBackground'), // Màu chuỗi
    special: new vscode.ThemeColor('editor.selectionHighlightBackground') // Màu giá trị đặc biệt
};

// **Syntax Highlighter**
export class MMOItemsSyntaxProvider implements vscode.DocumentSemanticTokensProvider {
    public static legend = new vscode.SemanticTokensLegend(['keyword', 'number', 'string', 'special']);

    provideDocumentSemanticTokens(
        document: vscode.TextDocument
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder(MMOItemsSyntaxProvider.legend);
        const text = document.getText();

        // **Highlight Keyword**
        MMOITEMS_KEYWORDS.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            let match;
            while ((match = regex.exec(text))) {
                builder.push(new vscode.Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + keyword.length),
                ), 'keyword');
            }
        });

        // **Highlight Numbers**
        const numberRegex = /\b\d+(\.\d+)?\b/g;
        let numberMatch;
        while ((numberMatch = numberRegex.exec(text))) {
            builder.push(new vscode.Range(
                document.positionAt(numberMatch.index),
                document.positionAt(numberMatch.index + numberMatch[0].length),
            ), 'number');
        }

        // **Highlight Strings (Tên, Mô Tả)**
        const stringRegex = /"(.*?)"/g;
        let stringMatch;
        while ((stringMatch = stringRegex.exec(text))) {
            builder.push(new vscode.Range(
                document.positionAt(stringMatch.index),
                document.positionAt(stringMatch.index + stringMatch[0].length),
            ), 'string');
        }

        // **Highlight Special Values (true, false, percent, mode)**
        const specialWords = ['true', 'false', 'LEFT_CLICK', 'RIGHT_CLICK', 'SHIFT_LEFT', 'SHIFT_RIGHT'];
        specialWords.forEach(special => {
            const regex = new RegExp(`\\b${special}\\b`, 'g');
            let match;
            while ((match = regex.exec(text))) {
                builder.push(new vscode.Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + special.length),
                ), 'special');
            }
        });

        return builder.build();
    }
}


export function registerSyntaxHighlight(context: vscode.ExtensionContext) {
    const provider = new MMOItemsSyntaxProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            { language: 'yaml' },
            provider,
            MMOItemsSyntaxProvider.legend
        )
    );
}
