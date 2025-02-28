import * as vscode from "vscode";
import * as yaml from "js-yaml";

// randomitem
export function registerRandomItemCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("mmoitems.randomItem", async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("❌ No YAML file is open.");
                return;
            }

            // Chọn tier vật phẩm
            const rarity = await vscode.window.showQuickPick(["common", "rare", "epic", "legendary"], {
                placeHolder: "Select an item tier",
            });

            if (!rarity) {
                vscode.window.showErrorMessage("❌ You have not selected an item tier!");
                return;
            }

            // Chọn type vật phẩm
            const material = await vscode.window.showQuickPick(
                ["SWORD", "AXE", "BOW", "STAFF", "HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS", "SHIELD", "CONSUMABLE", "MATERIAL", "GEM"],
                { placeHolder: "Select an item type" }
            );

            if (!material) {
                vscode.window.showErrorMessage("❌ You have not selected an item type!");
                return;
            }

            // random
            const newItem = generateRandomItem(rarity, material);
            const yamlData = yaml.dump(newItem);

            // add yaml
            editor.edit((editBuilder) => {
                editBuilder.insert(new vscode.Position(editor.selection.end.line + 2, 0), yamlData);
            });

            vscode.window.showInformationMessage(`✅ Random item generated (${rarity}, ${material})!`);
        })
    );
}

// Hàm random
function generateRandomItem(rarity: string, material: string) {
    const itemID = `ITEM_${Math.floor(Math.random() * 1000)}`;
    return {
        [itemID]: {
            base: {
                material,
                name: `${getRandomPrefix()} ${getRandomBaseName(material)} ${getRandomSuffix()}`,
                tier: rarity.toUpperCase(),
                unbreakable: true,
                hide_enchants: true,
                ...getBaseStats(rarity, material),
                enchants: getRandomEnchantments(rarity),
                ability: getRandomAbilities(material),
                lore: getRandomLore(material),
            },
        },
    };
}

// ép định dạng
function getBaseStats(rarity: string, material: string) {
    const multiplier = { common: 1, rare: 1.5, epic: 2, legendary: 3 }[rarity] || 1;

    const statsByMaterial: Record<string, string[]> = {
        SWORD: ["attack-damage", "physical-damage", "attack-speed"],
        AXE: ["attack-damage", "critical-strike-power", "attack-speed"],
        BOW: ["attack-damage", "arrow-velocity", "range"],
        STAFF: ["magic-damage", "mana-cost", "skill-critical-strike-power"],
        HELMET: ["max-health", "knockback-resistance", "magic-damage-reduction"],
        CHESTPLATE: ["armor", "defense", "pve-damage-reduction"],
        LEGGINGS: ["armor", "movement-speed", "stamina-regeneration"],
        BOOTS: ["movement-speed", "fall-damage-reduction", "jump-strength"],
        SHIELD: ["block-power", "block-rating", "parry-rating"],
        CONSUMABLE: ["restore-health", "restore-mana", "cooldown-reduction"],
        MATERIAL: ["durability", "mining-efficiency", "autosmelt"],
    };

    let stats: Record<string, number> = {};
    (statsByMaterial[material] || []).forEach((stat) => {
        stats[stat] = parseFloat((Math.random() * 10 * multiplier).toFixed(2));
    });

    return stats;
}

// Random ec
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

// Random skills
function getRandomAbilities(material: string) {
    const abilitiesByMaterial: Record<string, string[]> = {
        SWORD: ["Power Strike", "Bleed", "Lifesteal"],
        AXE: ["Armor Break", "Reckless Swing"],
        BOW: ["Piercing Arrow", "Multi-Shot"],
        STAFF: ["Fireball", "Chain Lightning"],
        HELMET: ["Mana Shield", "Health Boost"],
        CHESTPLATE: ["Thorns", "Fortress"],
        LEGGINGS: ["Sprint Boost", "Evasion"],
        BOOTS: ["Double Jump", "Feather Fall"],
        SHIELD: ["Block Mastery", "Parry"], //Thêm đại
        CONSUMABLE: ["Regeneration", "Mana Restore"], //Thêm đại
        MATERIAL: ["Refining", "Crafting Efficiency"], //Thêm đại
    };

    let abilities: Record<string, any> = {};
    let abilityCount = 1;
    const modes = ["LEFT_CLICK", "RIGHT_CLICK", "SHIFT_LEFT", "SHIFT_RIGHT"];
    let usedModes = new Set<string>();

    (abilitiesByMaterial[material] || []).forEach((ability) => {
        let availableMode = modes.find((mode) => !usedModes.has(mode)) || "LEFT_CLICK";
        usedModes.add(availableMode);

        abilities[`ability${abilityCount}`] = {
            type: ability,
            mode: availableMode,
            duration: parseFloat((Math.random() * 10).toFixed(1)),
            damage: parseFloat((Math.random() * 5).toFixed(1)),
            mana: parseFloat((Math.random() * 10).toFixed(1)),
            charge: parseFloat((Math.random() * 5).toFixed(1)),
            cooldown: parseFloat((Math.random() * 15 + 5).toFixed(1)),
        };

        abilityCount++;
    });

    return abilities;
}

// Random Lore
function getRandomLore(material: string) {
    const loreSamples: Record<string, string[]> = {
        SWORD: ["&eKỹ năng đặc biệt: &6Cường hóa &310s ⌛ &96.0 ★", "&7Chuột phải để cường hóa &f3 &7đòn"],
        BOW: ["&eBắn xuyên qua mục tiêu", "&7Tăng 15% tốc độ bắn"],
        STAFF: ["&eDùng phép thuật để thi triển sức mạnh"],
        CONSUMABLE: ["&eHồi phục sinh lực", "&7Dùng để chữa trị nhanh"],
    };

    return loreSamples[material] || ["&7Vật phẩm huyền bí..."];
}
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

function getRandomPrefix() { return ["Ancient", "Mystic", "Cursed", "Divine"][Math.floor(Math.random() * 4)]; }
function getRandomBaseName(material: string) { return material.charAt(0) + material.slice(1).toLowerCase(); }
function getRandomSuffix() { return ["of Doom", "of Power", "of the Gods", "of Shadows"][Math.floor(Math.random() * 4)]; }
