//PHÁT TRIỂN BỞI Salyyy - Trong đó có sự hỗ trợ của ChatGPT để fix lỗi và list các ability, stats, enchants và tạo format toolstip
import * as vscode from 'vscode';
import * as yaml from 'js-yaml';

export function activate(context: vscode.ExtensionContext) {
    console.log('✅ MMOItems Config Helper is now active!');

    const commands = [
        { name: "mmoitems.scaleItem", message: "Scaling MMOItem..." },
        { name: "mmoitems.preview", message: "Previewing MMOItem..." },
        { name: "mmoitems.randomItem", message: "Generating Random MMOItem..." },
    ];

    commands.forEach(({ name, message }) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(name, () => vscode.window.showInformationMessage(message))
        );
    });
}


//Gợi ý enchants, abiliy, stats
function dumpYamlWithoutQuotes(data: any): string {
    return yaml.dump(data, {
        schema: yaml.JSON_SCHEMA, 
        styles: {
            '!!int': 'decimal',   
            '!!float': 'decimal' 
        },
        lineWidth: -1 
    });
}

function handleError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

const abilityProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'yaml', scheme: 'file' },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text.trim();
            const lineCurrent = document.lineAt(position.line).text.trim();

            const isAbilitySection = /^ability\d*:/.test(lineAbove) || lineAbove === "ability:";
            const isInsideAbility = /^\s+(type|mode|duration|damage|mana|charge|cooldown):/.test(lineCurrent);
            const isEnchantSection = /^enchantments:/.test(lineAbove) || /^\s+- \w+/.test(lineCurrent);

            if (isEnchantSection) {
                return []; // Ẩn hết gợi ý khác nếu đang trong enchantments
            }

            if (isAbilitySection) {
                const text = document.getText();
                const existingAbilities = text.match(/ability\d*:/g);
                const abilityIndex = existingAbilities ? existingAbilities.length + 1 : 1;

                const modes = ["LEFT_CLICK", "RIGHT_CLICK", "SHIFT_LEFT", "SHIFT_RIGHT"];
                const usedModes = new Set<string>();
                const modeMatches = text.match(/mode: (\w+)/g);
                if (modeMatches) {
                    modeMatches.forEach(match => usedModes.add(match.split(": ")[1]));
                }
                const availableMode = modes.find(mode => !usedModes.has(mode)) || "LEFT_CLICK";

                return [
                    "Firebolt", "Ice Crystal", "Earthquake", "Sparkle", "Fire Meteor",
                    "Lightning Strike", "Shadow Blink", "Healing Touch", "Poison Nova",
                    "Explosion", "Wind Slash", "Thunder Storm", "Summon Minion",
                    "Teleport", "Blink", "Frost Blast", "Life Drain", "Venom Strike",
                    "Meteor Shower", "Holy Light", "Blood Leech", "Dark Curse",
                    "Whirlwind", "Flame Wave", "Arcane Barrage"
                ].map(ability => {
                    const item = new vscode.CompletionItem(ability, vscode.CompletionItemKind.Method);
                    item.detail = `🎯 MMOItems Ability: ${ability}`;
                    item.insertText = new vscode.SnippetString(
                        `ability${abilityIndex}:
  type: ${ability}
  mode: ${availableMode}
  duration: \${1|5.0,10.0,15.0|}
  damage: \${2|2.0,4.0,6.0|}
  mana: \${3|5.0,10.0,15.0|}
  charge: \${4|1.5,3.0,4.5|}
  cooldown: \${5|5.0,10.0,20.0|}`
                    );
                    item.documentation = new vscode.MarkdownString(
                        `📌 **${ability}**\n\n- **Type**: ${ability}\n- **Mode**: ${availableMode}\n- **Cooldown**: \`5-20s\`\n- **Damage**: \`2.0 - 6.0\`\n- **Mana Cost**: \`5 - 15\`\n\n*Tùy chỉnh thông số theo nhu cầu.*`
                    );
                    return item;
                });
            }

            if (isInsideAbility) {
                return [
                    "type", "mode", "duration", "damage", "mana", "charge", "cooldown"
                ].map(attr => new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property));
            }

            return [];
        }
    },
    ':'
);

const enchantmentProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'yaml', scheme: 'file' },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text;
            if (!lineAbove.includes('enchantments')) return [];

            return [
                "Sharpness", "Smite", "Bane of Arthropods", "Fire Aspect", "Knockback",
                "Looting", "Sweeping Edge", "Protection", "Fire Protection", "Blast Protection",
                "Projectile Protection", "Thorns", "Respiration", "Aqua Affinity", "Depth Strider",
                "Frost Walker", "Soul Speed", "Feather Falling", "Swift Sneak", "Efficiency",
                "Unbreaking", "Fortune", "Silk Touch", "Mending", "Curse of Vanishing",
                "Power", "Punch", "Flame", "Infinity", "Multishot", "Piercing", "Quick Charge",
                "Loyalty", "Riptide", "Channeling", "Impaling", "Lure", "Luck of the Sea"
            ].map(e => new vscode.CompletionItem(e, vscode.CompletionItemKind.EnumMember));
        }
    },
    ':'
);

const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'yaml', scheme: 'file' },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text.trim();
            if (lineAbove.includes('enchantments') || lineAbove.includes('ability')) return [];

            return [
                    // ⚔️ Weapon Stats
                    'attack-damage', 'attack-speed', 'critical-strike-chance', 'critical-strike-power',
                    'skill-critical-strike-chance', 'skill-critical-strike-power', 'range', 'arrow-velocity',

                    // 🛡️ Armor Stats
                    'block-power', 'block-rating', 'block-cooldown-reduction', 'dodge-rating',
                    'dodge-cooldown-reduction', 'parry-rating', 'parry-cooldown-reduction',
                    'armor', 'armor-toughness', 'knockback-resistance', 'max-health', 'movement-speed',

                    // 🔥 Extra Damage
                    'pve-damage', 'pvp-damage', 'magic-damage', 'weapon-damage',
                    'undead-damage', 'skill-damage', 'physical-damage', 'projectile-damage',

                    // 🛡️ Damage Reduction
                    'defense', 'damage-reduction', 'fall-damage-reduction', 'fire-damage-reduction',
                    'magic-damage-reduction', 'projectile-damage-reduction', 'physical-damage-reduction',
                    'pve-damage-reduction', 'pvp-damage-reduction',

                    // ⚡ RPG Stats
                    'health-regeneration', 'max-mana', 'mana-regeneration', 'max-stamina',
                    'stamina-regeneration', 'cooldown-reduction', 'additional-experience',

                    // 🏗️ 1.20.2+ Attributes
                    'block-break-speed', 'block-interaction-range', 'entity-interaction-range',
                    'fall-damage-multiplier', 'gravity', 'jump-strength', 'max-absorption',
                    'safe-fall-distance', 'scale', 'step-height', 'burning-time',
                    'explosion-knockback-resistance', 'mining-efficiency', 'movement-efficiency',
                    'oxygen-bonus', 'sneaking-speed', 'submerged-mining-speed', 'sweeping-damage-ratio',
                    'water-movement-efficiency',

                    // 🛠️ Extra Options
                    'perm-effects', 'commands', 'item-cooldown', 'arrow-potion-effects',

                    // 🍖 Consumables
                    'restore-health', 'restore-food', 'restore-saturation', 'restore-mana',
                    'restore-stamina', 'effects', 'repair', 'repair-percent', 'can-identify',
                    'can-deconstruct', 'can-deskin', 'success-rate', 'max-consume',

                    // 💎 Gem Stones
                    'gem-stone-lore', 'gem-sockets.empty', 'gem-sockets.filled',

                    // 👻 Soulbound
                    'soulbinding-chance', 'soulbound-break-chance', 'soulbound-level',

                    // ⚒️ Tools
                    'autosmelt', 'bouncing-crack', 'pickaxe-power', 'durability',

                    // 🏷️ General MMOItems Properties
                    'item-type', 'tier', 'required-class', 'required-level',

                    // 🔥 MMOCore Attributes
                    'required-dexterity', 'required-strength', 'required-intelligence',
                    'additional-dexterity', 'additional-strength', 'additional-intelligence',

                    // 🏗️ MMOCore Professions
                    'profession-alchemy', 'profession-enchanting', 'profession-farming',
                    'profession-fishing', 'profession-mining', 'profession-smelting',
                    'profession-smithing', 'profession-woodcutting',

                    // 🦸 Heroes Stats
                    'required-secondary-hero-level',

                    // ⚡ Elemental Stats
                    'element.damage', 'element.damage-percent', 'element.defense',
                    'element.defense-percent', 'element.weakness',

                    // 🍀 Custom Stats
                    'custom-myluck'
            ].map(stat => new vscode.CompletionItem(stat, vscode.CompletionItemKind.Property));
        }
    },
    ':'
);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//randomitem
    const randomItemCommand = vscode.commands.registerCommand('mmoitems.randomItem', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No files yaml, yml are open.");
            return;
        }

        // Chọn cấp độ vật phẩm
        const rarity = await vscode.window.showQuickPick(["common", "rare", "epic", "legendary"], {
            placeHolder: "Selected an item tier"
        });

        if (!rarity) {
            vscode.window.showErrorMessage("❌ You have not selected an item tier!");
            return;
        }

        // Chọn loại vật phẩm (Material)
        const material = await vscode.window.showQuickPick([
            "SWORD", "AXE", "BOW", "STAFF", "HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS",
            "SHIELD", "CONSUMABLE", "MATERIAL", "GEM"
        ], { placeHolder: "Sselected an item type" });

        if (!material) {
            vscode.window.showErrorMessage("❌ You have not selected an item type!");
            return;
        }

 
        const newItem = generateRandomItem(rarity, material);


        const yamlData = dumpYamlWithoutQuotes(newItem);

   
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(editor.selection.end.line + 2, 0), yamlData);
        });

        vscode.window.showInformationMessage(`✅ Random item generated (${rarity}, ${material})!`);
    });




    function generateRandomItem(rarity: string, material: string) {
        const itemID = `ITEM_${Math.floor(Math.random() * 1000)}`;
        const itemName = getRandomPrefix() + " " + getRandomBaseName(material) + " " + getRandomSuffix();
        const baseStats = getBaseStats(rarity, material);
        const enchantments = getRandomEnchantments(rarity);
        const abilities = getRandomAbilities(material);
        const lore = getRandomLore(material);

        return {
            [itemID]: {
                base: {
                    material: material,
                    name: itemName,
                    tier: rarity.toUpperCase(),
                    unbreakable: true,
                    hide_enchants: true,
                    ...baseStats,
                    enchantments,
                    ability: abilities,
                    lore
                }
            }
        };
    }

   
    function getBaseStats(rarity: string, material: string) {
        const multiplier = { common: 1, rare: 1.5, epic: 2, legendary: 3 }[rarity] || 1;

        const statsByMaterial: Record<string, string[]> = {
            "SWORD": ["attack-damage", "physical-damage", "attack-speed"],
            "AXE": ["attack-damage", "critical-strike-power", "attack-speed"],
            "BOW": ["attack-damage", "arrow-velocity", "range"],
            "STAFF": ["magic-damage", "mana-cost", "skill-critical-strike-power"],
            "HELMET": ["max-health", "knockback-resistance", "magic-damage-reduction"],
            "CHESTPLATE": ["armor", "defense", "pve-damage-reduction"],
            "LEGGINGS": ["armor", "movement-speed", "stamina-regeneration"],
            "BOOTS": ["movement-speed", "fall-damage-reduction", "jump-strength"],
            "SHIELD": ["block-power", "block-rating", "parry-rating"],
            "CONSUMABLE": ["restore-health", "restore-mana", "cooldown-reduction"],
            "MATERIAL": ["durability", "mining-efficiency", "autosmelt"]
        };

        let stats: Record<string, number> = {};
        (statsByMaterial[material] || []).forEach(stat => {
            stats[stat] = parseFloat((Math.random() * 10 * multiplier).toFixed(2));
        });

        return stats;
    }



function getRandomEnchantments(rarity: string) {
    const allEnchantments = [
        "Sharpness", "Smite", "Bane of Arthropods", "Fire Aspect", "Knockback",
        "Looting", "Sweeping Edge", "Protection", "Fire Protection", "Blast Protection",
        "Projectile Protection", "Thorns", "Respiration", "Aqua Affinity", "Depth Strider",
        "Frost Walker", "Soul Speed", "Feather Falling", "Swift Sneak", "Efficiency",
        "Unbreaking", "Fortune", "Silk Touch", "Mending", "Curse of Vanishing",
        "Power", "Punch", "Flame", "Infinity", "Multishot", "Piercing", "Quick Charge",
        "Loyalty", "Riptide", "Channeling", "Impaling", "Lure", "Luck of the Sea"
    ];
    const numEnchant = { common: 1, rare: 2, epic: 3, legendary: 4 }[rarity] || 1;
    const result: Record<string, number> = {};

    for (let i = 0; i < numEnchant; i++) {
        const enchant = allEnchantments[Math.floor(Math.random() * allEnchantments.length)];
        result[enchant] = Math.ceil(Math.random() * 5);
    }

    return result;
}

function getRandomAbilities(material: string) {
    const abilitiesByMaterial: Record<string, string[]> = {
        "SWORD": ["Power Strike", "Bleed", "Lifesteal"],
        "AXE": ["Armor Break", "Reckless Swing"],
        "BOW": ["Piercing Arrow", "Multi-Shot"],
        "STAFF": ["Fireball", "Chain Lightning"],
        "HELMET": ["Mana Shield", "Health Boost"],
        "CHESTPLATE": ["Thorns", "Fortress"],
        "LEGGINGS": ["Sprint Boost", "Evasion"],
        "BOOTS": ["Double Jump", "Feather Fall"],
        "SHIELD": ["Block Mastery", "Parry"],
        "CONSUMABLE": ["Regeneration", "Mana Restore"],
        "MATERIAL": ["Refining", "Crafting Efficiency"]
    };

    let abilities: Record<string, any> = {};
    let abilityCount = 1;
    const modes = ["LEFT_CLICK", "RIGHT_CLICK", "SHIFT_LEFT", "SHIFT_RIGHT"];
    let usedModes = new Set<string>();

    (abilitiesByMaterial[material] || []).forEach(ability => {
        
        let availableMode = modes.find(mode => !usedModes.has(mode)) || "LEFT_CLICK";
        usedModes.add(availableMode);

        abilities[`ability${abilityCount}`] = {
            type: ability,
            mode: availableMode,
            duration: parseFloat((Math.random() * 10).toFixed(1)), 
            damage: parseFloat((Math.random() * 5).toFixed(1)),
            mana: parseFloat((Math.random() * 10).toFixed(1)),
            charge: parseFloat((Math.random() * 5).toFixed(1)),
            cooldown: parseFloat((Math.random() * 15 + 5).toFixed(1))
        };

        abilityCount++;
    });

    return abilities;
}


function getRandomLore(material: string) {
    const loreSamples: Record<string, string[]> = {
        "SWORD": [
            "&eKỹ năng đặc biệt: &6Cường hóa &310s ⌛ &96.0 ★",
            "&7Chuột phải để cường hóa &f3 &7đòn",
            "&7đánh kế tiếp của bạn, gây thêm",
            "&7&c2.0 sát thương vật lí&7."
        ],
        "BOW": ["&eBắn xuyên qua mục tiêu", "&7Tăng 15% tốc độ bắn"],
        "STAFF": ["&eDùng phép thuật để thi triển sức mạnh"],
        "CONSUMABLE": ["&eHồi phục sinh lực", "&7Dùng để chữa trị nhanh"]
    };

    return loreSamples[material] || ["&7Vật phẩm huyền bí..."];
}

function getRandomPrefix() {
    const prefixes = ["Ancient", "Mystic", "Cursed", "Divine"];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
}

function getRandomBaseName(material: string) {
    return material.charAt(0) + material.slice(1).toLowerCase();
}

function getRandomSuffix() {
    const suffixes = ["of Doom", "of Power", "of the Gods", "of Shadows"];
    return suffixes[Math.floor(Math.random() * suffixes.length)];
}



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//  MMOItems Simulator
const previewCommand = vscode.commands.registerCommand('mmoitems.preview', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("❌ No files are open.");
        return;
    }

    const text = editor.document.getText();
    try {
        const yamlData = yaml.load(text) as Record<string, any> | undefined;
        if (!yamlData || typeof yamlData !== 'object') {
            throw new Error("Invalid data!");
        }

        const panel = vscode.window.createWebviewPanel(
            'mmoitemsPreview',
            'MMOItems Simulator',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );
        panel.webview.html = getPreviewHtml(yamlData);
    } catch (error) {
        vscode.window.showErrorMessage(`❌ YAML error: ${handleError(error)}`);
    }
});


const statMappings: Record<string, { display: string; icon: string }> = {
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


function getPreviewHtml(data: Record<string, any>): string {
    let content = `

    <style>
@font-face {
    font-family: 'Minecraft';
    src: url('https://cdn.jsdelivr.net/gh/IdreesInc/Minecraft-Font@latest/minecraftia.ttf') format('truetype');

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
        if (data[key]?.base) {
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
                content += `<div class="lore">${item.lore.map((line: string) => convertColorTags(line)).join('<br>')}</div>`;
            } else if (typeof item.lore === 'string') {
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
function convertMinecraftColor(code: string): string {
    const colors: Record<string, string> = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
    };
    return colors[code.toLowerCase()] || '#FFFFFF';
}

function convertColorTags(text: string): string {
    if (!text) return text;


    text = text.replace(/&#([0-9a-fA-F]{6})/g, `<span style="color:#$1">`);

    text = text.replace(/<#([0-9a-fA-F]{6})>(.*?)</g, `<span style="color:#$1">$2</span>`);

    text = text.replace(/\[COLOR=#([0-9a-fA-F]{6})\](.*?)\[\/COLOR\]/g, `<span style="color:#$1">$2</span>`);

    text = text.replace(/<gradient:#([0-9a-fA-F]{6}):#([0-9a-fA-F]{6})>(.*?)<\/gradient>/g,
        `<span style="background: linear-gradient(to right, #$1, #$2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$3</span>`);


    text = text.replace(/<##([0-9a-fA-F]{6})>(.)/g, `<span style="color:#$1">$2</span>`);


    text = text.replace(/§x(§[0-9a-fA-F]){6}/g, match => {
        let hex = match.replace(/§x|§/g, '');
        return `<span style="color:#${hex}">`;
    });


    text = text.replace(/&x((&[0-9a-fA-F]){6})/g, match => {
        let hex = match.replace(/&x|&/g, '');
        return `<span style="color:#${hex}">`;
    });


    text = text.replace(/&([0-9a-fA-F])/g, (_, code) => `<span style="color:${convertMinecraftColor(code)}">`);


    const openTags = (text.match(/<span/g) || []).length;
    const closeTags = (text.match(/<\/span>/g) || []).length;
    if (openTags > closeTags) {
        text += '</span>'.repeat(openTags - closeTags);
    }

    return text;
}


const scaleCommand = vscode.commands.registerCommand('mmoitems.scaleItem', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) {
        return vscode.window.showErrorMessage("❌ Please highlight an item before scaling.");
    }

    let levelFormat = await vscode.window.showInputBox({
        prompt: "Enter level format:\n- Use %lv% as the level placeholder\n- Use %name% to keep the item name",
        value: "%name% &8[&eLv.%lv%&8]"
    });


    if (!levelFormat) {
        levelFormat = "%name% &8[&eLv.%lv%&8]";
    }

    const text = editor.document.getText(editor.selection);
    let yamlData;
    try {
        yamlData = yaml.load(text) as Record<string, any>;
        if (!yamlData || typeof yamlData !== "object") throw new Error();
    } catch {
        return vscode.window.showErrorMessage("❌ Error: Invalid YAML data!");
    }

    const itemKey = Object.keys(yamlData)[0];
    const baseStats = yamlData[itemKey]?.base ?? {};
    const itemName = yamlData[itemKey]?.base?.name || "Item";
    const statsScaleFactors: Record<string, number> = {};

    const originalYamlData = JSON.parse(JSON.stringify(yamlData)); // Giữ bản gốc

    for (const stat of Object.keys(baseStats)) {
        if (typeof baseStats[stat] === "number") {
            const scaleInput = await vscode.window.showInputBox({
                prompt: `Enter boost percentage for '${stat}':\n- Example: 50 = increase by 50%\n- Leave empty to keep the current value`

            });

            if (!scaleInput) {
                statsScaleFactors[stat] = 1; // Giữ nguyên nếu để trống
            } else if (isNaN(Number(scaleInput))) {
                vscode.window.showErrorMessage(`❌ Invalid value for${stat}`);
                return;
            } else {
                statsScaleFactors[stat] = (Number(scaleInput) / 100) + 1;
            }
        }
    }

    const amountInput = await vscode.window.showInputBox({ prompt: "Enter the number of items to scale (Example: 3)" });
    if (!amountInput || isNaN(Number(amountInput))) {
        return vscode.window.showErrorMessage("❌ Please enter a valid quantity!");
    }

    const scaleAmount = Number(amountInput);
    const newYamlData: Record<string, any> = { ...originalYamlData }; // Giữ nguyên bản gốc
    const baseLevel = parseInt(itemKey.match(/Lv(\d+)/)?.[1] || "1", 10);

    for (let i = 0; i < scaleAmount; i++) {
        const newLevel = baseLevel + i + 1;
        const newItemKey = `${itemKey.split("_Lv")[0]}_Lv${newLevel}`;
        newYamlData[newItemKey] = JSON.parse(JSON.stringify(yamlData[itemKey]));
        const newItem = newYamlData[newItemKey].base;

        newItem.name = levelFormat.replace("%lv%", `${newLevel}`).replace("%name%", itemName);

        for (const stat in statsScaleFactors) {
            if (typeof newItem[stat] === "number") {
                newItem[stat] = parseFloat((newItem[stat] * statsScaleFactors[stat]).toFixed(2));
            }
        }

        if (newItem.ability) {
            for (const abilityKey in newItem.ability) {
                const ability = newItem.ability[abilityKey];
                if (typeof ability === "object") {
                    for (const attr in ability) {
                        if (typeof ability[attr] === "number") {
                            const scaleInput = await vscode.window.showInputBox({
                                prompt: `Enter boost percentage for '${attr}' of '${abilityKey}':\n- Example: 50 = increase by 50%\n- Leave empty to keep the current value`

                            });

                            let factor = 1; // Mặc định giữ nguyên nếu để trống
                            if (scaleInput && !isNaN(Number(scaleInput))) {
                                factor = (Number(scaleInput) / 100) + 1;
                            }

                            ability[attr] = parseFloat((ability[attr] * factor).toFixed(2));
                        }
                    }
                }
            }
        }
    }

    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, yaml.dump(newYamlData, { schema: yaml.JSON_SCHEMA, lineWidth: -1 }));
    });
    vscode.window.showInformationMessage(`✅ Scaled ${scaleAmount} items successfully!`);
});


console.log("Debugging MMOItems extension...");
export function deactivate() {}
