"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSyntaxHighlight = exports.MMOItemsSyntaxProvider = void 0;
const vscode = __importStar(require("vscode"));
const MMOITEMS_KEYWORDS = [
    'type', 'id', 'name', 'lore', 'tier', 'material', 'attack-damage', 'attack-speed',
    'durability', 'enchantments', 'custom-model-data', 'abilities', 'stats', 'gem-stones',
    'soulbound', 'required-class', 'required-level', 'pve-damage', 'pvp-damage',
    'armor', 'defense', 'mana-regeneration', 'cooldown-reduction', 'item-cooldown'
];
// **Màu sắc theo theme Minecraft**
const MMOITEMS_THEME = {
    keyword: new vscode.ThemeColor('editor.foreground'),
    number: new vscode.ThemeColor('editor.lineHighlightBackground'),
    string: new vscode.ThemeColor('editor.hoverHighlightBackground'),
    special: new vscode.ThemeColor('editor.selectionHighlightBackground') // Màu giá trị đặc biệt
};
// **Syntax Highlighter**
class MMOItemsSyntaxProvider {
    provideDocumentSemanticTokens(document) {
        const builder = new vscode.SemanticTokensBuilder(MMOItemsSyntaxProvider.legend);
        const text = document.getText();
        // **Highlight Keyword**
        MMOITEMS_KEYWORDS.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            let match;
            while ((match = regex.exec(text))) {
                builder.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + keyword.length)), 'keyword');
            }
        });
        // **Highlight Numbers**
        const numberRegex = /\b\d+(\.\d+)?\b/g;
        let numberMatch;
        while ((numberMatch = numberRegex.exec(text))) {
            builder.push(new vscode.Range(document.positionAt(numberMatch.index), document.positionAt(numberMatch.index + numberMatch[0].length)), 'number');
        }
        // **Highlight Strings (Tên, Mô Tả)**
        const stringRegex = /"(.*?)"/g;
        let stringMatch;
        while ((stringMatch = stringRegex.exec(text))) {
            builder.push(new vscode.Range(document.positionAt(stringMatch.index), document.positionAt(stringMatch.index + stringMatch[0].length)), 'string');
        }
        // **Highlight Special Values (true, false, percent, mode)**
        const specialWords = ['true', 'false', 'LEFT_CLICK', 'RIGHT_CLICK', 'SHIFT_LEFT', 'SHIFT_RIGHT'];
        specialWords.forEach(special => {
            const regex = new RegExp(`\\b${special}\\b`, 'g');
            let match;
            while ((match = regex.exec(text))) {
                builder.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + special.length)), 'special');
            }
        });
        return builder.build();
    }
}
exports.MMOItemsSyntaxProvider = MMOItemsSyntaxProvider;
MMOItemsSyntaxProvider.legend = new vscode.SemanticTokensLegend(['keyword', 'number', 'string', 'special']);
function registerSyntaxHighlight(context) {
    const provider = new MMOItemsSyntaxProvider();
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'yaml' }, provider, MMOItemsSyntaxProvider.legend));
}
exports.registerSyntaxHighlight = registerSyntaxHighlight;
