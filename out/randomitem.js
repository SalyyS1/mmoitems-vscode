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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRandomItemCommand = void 0;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
// randomitem
function registerRandomItemCommand(context) {
    context.subscriptions.push(vscode.commands.registerCommand("mmoitems.randomItem", () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No YAML file is open.");
            return;
        }
        // Chọn tier vật phẩm
        const rarity = yield vscode.window.showQuickPick(["common", "rare", "epic", "legendary"], {
            placeHolder: "Select an item tier",
        });
        if (!rarity) {
            vscode.window.showErrorMessage("❌ You have not selected an item tier!");
            return;
        }
        // Chọn type vật phẩm
        const material = yield vscode.window.showQuickPick(["SWORD", "AXE", "BOW", "STAFF", "HELMET", "CHESTPLATE", "LEGGINGS", "BOOTS", "SHIELD", "CONSUMABLE", "MATERIAL", "GEM"], { placeHolder: "Select an item type" });
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
    })));
}
exports.registerRandomItemCommand = registerRandomItemCommand;
// Hàm random
function generateRandomItem(rarity, material) {
    const itemID = `ITEM_${Math.floor(Math.random() * 1000)}`;
    return {
        [itemID]: {
            base: Object.assign(Object.assign({ material, name: `${getRandomPrefix()} ${getRandomBaseName(material)} ${getRandomSuffix()}`, tier: rarity.toUpperCase(), unbreakable: true, hide_enchants: true }, getBaseStats(rarity, material)), { enchants: getRandomEnchantments(rarity), ability: getRandomAbilities(material), lore: getRandomLore(material) }),
        },
    };
}
// ép định dạng
function getBaseStats(rarity, material) {
    const multiplier = { common: 1, rare: 1.5, epic: 2, legendary: 3 }[rarity] || 1;
    const statsByMaterial = {
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
    let stats = {};
    (statsByMaterial[material] || []).forEach((stat) => {
        stats[stat] = parseFloat((Math.random() * 10 * multiplier).toFixed(2));
    });
    return stats;
}
// Random ec
function getRandomEnchantments(rarity) {
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
    const result = {};
    for (let i = 0; i < numEnchant; i++) {
        const enchant = allEnchantments[Math.floor(Math.random() * allEnchantments.length)];
        result[enchant] = Math.ceil(Math.random() * 5);
    }
    return result;
}
// Random skills
function getRandomAbilities(material) {
    const abilitiesByMaterial = {
        SWORD: ["Power Strike", "Bleed", "Lifesteal"],
        AXE: ["Armor Break", "Reckless Swing"],
        BOW: ["Piercing Arrow", "Multi-Shot"],
        STAFF: ["Fireball", "Chain Lightning"],
        HELMET: ["Mana Shield", "Health Boost"],
        CHESTPLATE: ["Thorns", "Fortress"],
        LEGGINGS: ["Sprint Boost", "Evasion"],
        BOOTS: ["Double Jump", "Feather Fall"],
        SHIELD: ["Block Mastery", "Parry"],
        CONSUMABLE: ["Regeneration", "Mana Restore"],
        MATERIAL: ["Refining", "Crafting Efficiency"], //Thêm đại
    };
    let abilities = {};
    let abilityCount = 1;
    const modes = ["LEFT_CLICK", "RIGHT_CLICK", "SHIFT_LEFT", "SHIFT_RIGHT"];
    let usedModes = new Set();
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
function getRandomLore(material) {
    const loreSamples = {
        SWORD: ["&eKỹ năng đặc biệt: &6Cường hóa &310s ⌛ &96.0 ★", "&7Chuột phải để cường hóa &f3 &7đòn"],
        BOW: ["&eBắn xuyên qua mục tiêu", "&7Tăng 15% tốc độ bắn"],
        STAFF: ["&eDùng phép thuật để thi triển sức mạnh"],
        CONSUMABLE: ["&eHồi phục sinh lực", "&7Dùng để chữa trị nhanh"],
    };
    return loreSamples[material] || ["&7Vật phẩm huyền bí..."];
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
function getRandomPrefix() { return ["Ancient", "Mystic", "Cursed", "Divine"][Math.floor(Math.random() * 4)]; }
function getRandomBaseName(material) { return material.charAt(0) + material.slice(1).toLowerCase(); }
function getRandomSuffix() { return ["of Doom", "of Power", "of the Gods", "of Shadows"][Math.floor(Math.random() * 4)]; }
