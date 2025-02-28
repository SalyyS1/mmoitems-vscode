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
exports.registerPreviewCommand = void 0;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
function handleError(error) {
    return error instanceof Error ? error.message : String(error);
}
function registerPreviewCommand(context) {
    const previewCommand = vscode.commands.registerCommand('mmoitems.preview', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No files are open.");
            return;
        }
        const text = editor.document.getText();
        try {
            const yamlData = yaml.load(text);
            if (!yamlData || typeof yamlData !== 'object') {
                throw new Error("Invalid data!");
            }
            const panel = vscode.window.createWebviewPanel('mmoitemsPreview', 'MMOItems Simulator', vscode.ViewColumn.Beside, { enableScripts: true });
            panel.webview.html = getPreviewHtml(yamlData);
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ YAML error: ${handleError(error)}`);
        }
    });
    // **Mapping stats **
    const statMappings = {
        // ⚔️ Weapon Stats
        "attack-damage": { display: "Attack Damage", icon: "⚔️" },
        "attack-speed": { display: "Attack Speed", icon: "⏩" },
        "critical-strike-chance": { display: "Critical Strike Chance", icon: "🔥" },
        "critical-strike-power": { display: "Critical Strike Power", icon: "💥" },
        "range": { display: "Attack Range", icon: "🎯" },
        "arrow-velocity": { display: "Arrow Velocity", icon: "🏹" },
        // 🛡️ Armor Stats
        "block-power": { display: "Block Power", icon: "🛡️" },
        "block-rating": { display: "Block Rating", icon: "📊" },
        "max-health": { display: "Max Health", icon: "❤️" },
        "armor": { display: "Armor", icon: "🛡️" },
        "movement-speed": { display: "Movement Speed", icon: "🚀" },
        // 🔥 Extra Damage
        "pve-damage": { display: "PvE Damage", icon: "👹" },
        "pvp-damage": { display: "PvP Damage", icon: "⚔️" },
        "magic-damage": { display: "Magic Damage", icon: "✨" },
        "physical-damage": { display: "Physical Damage", icon: "💀" },
        // 🛡️ Damage Reduction
        "defense": { display: "Damage Resistance", icon: "🛡️" },
        "fire-damage-reduction": { display: "Fire Resistance", icon: "🔥" },
        "projectile-damage-reduction": { display: "Projectile Resistance", icon: "🏹" },
        // ⚡ RPG Stats
        "health-regeneration": { display: "Health Regeneration", icon: "❤️‍🩹" },
        "max-mana": { display: "Max Mana", icon: "🔷" },
        "mana-regeneration": { display: "Mana Regeneration", icon: "🔄" },
        "stamina-regeneration": { display: "Stamina Regeneration", icon: "⚡" },
        // 🛠️ Extra Options
        "item-cooldown": { display: "Item Cooldown", icon: "⏳" },
        "restore-health": { display: "Restore Health", icon: "🩸" },
        "restore-mana": { display: "Restore Mana", icon: "🔷" },
        "success-rate": { display: "Success Rate", icon: "🎲" }
    };
    function getPreviewHtml(data) {
        var _a;
        let content = `

    <style>
@font-face {
    font-family: 'Minecraft';
    src: url('https://cdn.jsdelivr.net/gh/IdreesInc/Minecraft-Font@latest/minecraftia.ttf') format('truetype');
@keyframes shuffleText {
    0% { opacity: 1; }
    25% { opacity: 0.5; transform: scale(1.1); }
    50% { opacity: 1; transform: scale(1); }
    75% { opacity: 0.5; transform: scale(0.9); }
    100% { opacity: 1; }
}
}

body {
    font-family: 'Minecraft', sans-serif;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 10px;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.tooltip {
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(20, 20, 20, 0.95);
    padding: 10px;
    width: 340px;
    border-radius: 4px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.7);
}

.title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.material-icon {
    width: 20px;
    height: 20px;
    margin-right: 6px;
}

.lore {
    font-style: italic;
    color: #aaa;
    margin-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 4px;
}

.stat {
    color: #55FF55;
    margin-top: 4px;
}

.enchant {
    color: #FFAA00;
    margin-top: 4px;
}

.tier {
    font-weight: bold;
    color: gold;
    margin-top: 6px;
}

.separator {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin: 6px 0;
}

.shadow {
    text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.75);
}

    </style>`;
        for (const key in data) {
            if ((_a = data[key]) === null || _a === void 0 ? void 0 : _a.base) {
                const item = data[key].base;
                const material = item.material || "UNKNOWN";
                const materialIconUrl = `https://minecraft.wiki/images/${material}.png`;
                content += `<div class="tooltip">`;
                if (typeof item.name === 'string') {
                    content += `<div class="title">
                                <img src="${materialIconUrl}" class="material-icon" onerror="this.style.display='none'">
                                ${convertColorTags(item.name)}
                            </div>`;
                }
                content += `<div class="stat"><strong>🔹 Material:</strong> ${material}</div>`;
                if (typeof item.tier === 'string') {
                    content += `<div class="tier">Tier: ${item.tier}</div>`;
                }
                if (Array.isArray(item.lore)) {
                    content += `<div class="lore">${item.lore.map((line) => convertColorTags(line)).join('<br>')}</div>`;
                }
                else if (typeof item.lore === 'string') {
                    content += `<div class="lore">${convertColorTags(item.lore)}</div>`;
                }
                content += `<div class="separator"></div>`;
                Object.keys(item).forEach(stat => {
                    if (statMappings[stat]) {
                        content += `<div class="stat">${statMappings[stat].icon} ${convertColorTags(statMappings[stat].display)}: ${item[stat]}</div>`;
                    }
                });
                content += `<div class="separator"></div>`;
                if (typeof item.enchantments === 'object' && item.enchantments !== null) {
                    content += `<div class="enchant">🔮 <strong>Enchantments:</strong></div>`;
                    for (const enchant in item.enchantments) {
                        content += `<div class="enchant">- ${enchant} ${item.enchantments[enchant]}</div>`;
                    }
                }
                content += `</div><br>`;
            }
        }
        return `<html><body>${content}</body></html>`;
    }
    function convertColorTags(text) {
        if (!text)
            return text;
        let activeColor = "";
        let activeFormats = [];
        //  (&x&F&1&F&6&9&C)**
        text = text.replace(/&x((&[0-9a-fA-F]){6})/g, match => {
            let hex = match.replace(/&x|&/g, '');
            activeColor = `color:#${hex};`;
            return `<span style="${activeColor}">`;
        });
        //  (§x§F§1§F§6§9§C)**
        text = text.replace(/§x((§[0-9a-fA-F]){6})/g, match => {
            let hex = match.replace(/§x|§/g, '');
            activeColor = `color:#${hex};`;
            return `<span style="${activeColor}">`;
        });
        //  &1, &2, ... &f**
        text = text.replace(/&([0-9a-fA-F])/g, (_, code) => {
            const colorCodes = {
                '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
                '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
                '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
                'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
            };
            activeColor = `color:${colorCodes[code]};`;
            return `<span style="${activeColor}">`;
        });
        //  `<#084CFB>B<#2064FB>i...`**
        text = text.replace(/<#([0-9a-fA-F]{6})>/g, (_, hex) => {
            activeColor = `color:#${hex};`;
            return `<span style="${activeColor}">`;
        });
        // ✅ Chuyển đổi HEX dạng `&#084CFBText`
        text = text.replace(/&#([0-9a-fA-F]{6})/g, `<span style="color:#$1">`);
        // ✅ Chuyển đổi MiniMessage `<#HEX>Text`
        text = text.replace(/<#([0-9a-fA-F]{6})>(.*?)</g, `<span style="color:#$1">$2</span>`);
        // ✅ Chuyển đổi Adventure `[COLOR=#HEX]Text[/COLOR]`
        text = text.replace(/\[COLOR=#([0-9a-fA-F]{6})\](.*?)\[\/COLOR\]/g, `<span style="color:#$1">$2</span>`);
        // ✅ Chuyển đổi MiniMessage `<gradient:#084CFB:#ADF3FD>Text</gradient>`
        text = text.replace(/<gradient:#([0-9a-fA-F]{6}):#([0-9a-fA-F]{6})>(.*?)<\/gradient>/g, `<span style="background: linear-gradient(to right, #$1, #$2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$3</span>`);
        // ✅ Chuyển đổi MMOItems `<##084CFB>B<##2064FB>i`
        text = text.replace(/<##([0-9a-fA-F]{6})>(.)/g, `<span style="color:#$1">$2</span>`);
        // ✅ Chuyển đổi Minecraft `§x§0§8§4§C§F§B`
        text = text.replace(/§x(§[0-9a-fA-F]){6}/g, match => {
            let hex = match.replace(/§x|§/g, '');
            return `<span style="color:#${hex}">`;
        });
        // ✅ Chuyển đổi mã màu kiểu `&x&F&1&F&6&9&C` từng ký tự một
        text = text.replace(/&x((&[0-9a-fA-F]){6})/g, match => {
            let hex = match.replace(/&x|&/g, '');
            return `<span style="color:#${hex}">`;
        });
        // ✅ Chuyển đổi Minecraft `&7[&b+1&7]`
        text = text.replace(/&([0-9a-fA-F])/g, (_, code) => `<span style="color:${convertColorTags(code)}">`);
        //  (&l, &o, &m, &k, &r)**
        text = text.replace(/&([lmnork])/g, (_, format) => {
            let formatStyles = {
                "l": "font-weight:bold;",
                "n": "text-decoration:underline;",
                "m": "text-decoration:line-through;",
                "o": "font-style:italic;",
                "k": "animation: shuffleText 1s infinite;",
                "r": "",
                "L": "font-weight:bold;",
                "N": "text-decoration:underline;",
                "M": "text-decoration:line-through;",
                "O": "font-style:italic;",
                "K": "animation: shuffleText 1s infinite;",
                "R": "" // space
            };
            if (format === "r") {
                activeFormats = [];
                activeColor = "";
                return "</span>";
            }
            activeFormats.push(formatStyles[format]);
            return `<span style="${activeColor}${activeFormats.join("")}">`;
        });
        //  `<##084CFB>B<##2064FB>i`**
        text = text.replace(/<##([0-9a-fA-F]{6})>(.)/g, (_, hex, char) => {
            return `<span style="color:#${hex}">${char}</span>`;
        });
        const openTags = (text.match(/<span/g) || []).length;
        const closeTags = (text.match(/<\/span>/g) || []).length;
        if (openTags > closeTags) {
            text += '</span>'.repeat(openTags - closeTags);
        }
        return text;
    }
    function dumpYamlWithoutQuotes(data) {
        return yaml.dump(data, {
            schema: yaml.JSON_SCHEMA,
            styles: {
                '!!int': 'decimal',
                '!!float': 'decimal'
            },
            lineWidth: -1
        });
    }
}
exports.registerPreviewCommand = registerPreviewCommand;
