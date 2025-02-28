import * as vscode from "vscode";

// Gợi ý Ability
const abilityProvider = vscode.languages.registerCompletionItemProvider(
    { language: "yaml", scheme: "file" },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text.trim();
            const lineCurrent = document.lineAt(position.line).text.trim();

            const isAbilitySection = /^ability\d*:/.test(lineAbove) || lineAbove === "ability:";
            const isInsideAbility = /^\s+(type|mode|duration|damage|mana|charge|cooldown):/.test(lineCurrent);

            if (isAbilitySection) {
                const text = document.getText();
                const existingAbilities = text.match(/ability\d*:/g);
                const abilityIndex = existingAbilities ? existingAbilities.length + 1 : 1;

                const modes = ["LEFT_CLICK", "RIGHT_CLICK", "SHIFT_LEFT", "SHIFT_RIGHT"];
                const usedModes = new Set<string>();
                (text.match(/mode: (\w+)/g) || []).forEach(match => usedModes.add(match.split(": ")[1]));
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
                    return item;
                });
            }

            if (isInsideAbility) {
                return ["type", "mode", "duration", "damage", "mana", "charge", "cooldown"].map(
                    attr => new vscode.CompletionItem(attr, vscode.CompletionItemKind.Property)
                );
            }

            return [];
        }
    },
);

// Gợi ý Enchantment
const enchantmentProvider = vscode.languages.registerCompletionItemProvider(
    { language: "yaml", scheme: "file" },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text;
            if (!lineAbove.includes("enchants")) return [];
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
);

// Gợi ý Stats
const statsProvider = vscode.languages.registerCompletionItemProvider(
    { language: "yaml", scheme: "file" },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text.trim();
            if (lineAbove.includes("enchants") || lineAbove.includes("ability")) return [];

            const stats = [
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
            ];

            return stats.map(stat => new vscode.CompletionItem(stat, vscode.CompletionItemKind.Property));
        }
    },
);

// Gợi ý Material (Gợi ý khi nhập `material`)
export const materialProvider = vscode.languages.registerCompletionItemProvider(
    { language: "yaml", scheme: "file" },
    {
        provideCompletionItems(document, position) {
            const line = document.lineAt(position.line).text.trim();

            // ✅ Chỉ hiển thị gợi ý nếu dòng bắt đầu bằng `material:`
            if (!/^material\s*:\s*$/.test(line)) return [];

            const materials = [
                "ACACIA_BOAT", "ACACIA_BUTTON", "ACACIA_CHEST_BOAT", "ACACIA_DOOR",
                "ACACIA_FENCE", "ACACIA_FENCE_GATE", "ACACIA_HANGING_SIGN", "ACACIA_LEAVES",
                "ACACIA_LOG", "ACACIA_PLANKS", "ACACIA_PRESSURE_PLATE", "ACACIA_SAPLING",
                "ACACIA_SIGN", "ACACIA_SLAB", "ACACIA_STAIRS", "ACACIA_TRAPDOOR",
                "ACACIA_WOOD", "ACTIVATOR_RAIL", "ALLIUM", "AMETHYST_BLOCK",
                "AMETHYST_CLUSTER", "ANCIENT_DEBRIS", "ANVIL", "AZALEA", "AXOLOTL_BUCKET",
                "DIAMOND_SWORD", "IRON_HELMET", "GOLDEN_CHESTPLATE", "LEATHER_LEGGINGS",
                "CHAINMAIL_BOOTS", "NETHERITE_AXE", "STONE_PICKAXE", "WOODEN_SHOVEL",
                "DIAMOND_HOE", "IRON_HORSE_ARMOR", "GOLDEN_HORSE_ARMOR", "LEATHER_HORSE_ARMOR",
                "CHAINMAIL_HORSE_ARMOR", "NETHERITE_HORSE_ARMOR", "STONE_HORSE_ARMOR",
                "WOODEN_HORSE_ARMOR", "DIAMOND_SHIELD", "IRON_SHIELD", "GOLDEN_SHIELD",
                "LEATHER_SHIELD", "CHAINMAIL_SHIELD", "NETHERITE_SHIELD", "STONE_SHIELD",
                "WOODEN_SHIELD", "DIAMOND_BOW", "IRON_BOW", "GOLDEN_BOW", "LEATHER_BOW",
                "CHAINMAIL_BOW", "NETHERITE_BOW", "STONE_BOW", "WOODEN_BOW",
                "DIAMOND_CROSSBOW", "IRON_CROSSBOW", "GOLDEN_CROSSBOW", "LEATHER_CROSSBOW",
                "CHAINMAIL_CROSSBOW", "NETHERITE_CROSSBOW", "STONE_CROSSBOW", "WOODEN_CROSSBOW",
                "DIAMOND_TRIDENT", "IRON_TRIDENT", "GOLDEN_TRIDENT", "LEATHER_TRIDENT",
                "CHAINMAIL_TRIDENT", "NETHERITE_TRIDENT", "STONE_TRIDENT", "WOODEN_TRIDENT",
                "DIAMOND_ELYTRA", "IRON_ELYTRA", "GOLDEN_ELYTRA", "LEATHER_ELYTRA",
                "CHAINMAIL_ELYTRA", "NETHERITE_ELYTRA", "STONE_ELYTRA", "WOODEN_ELYTRA",
                "DIAMOND_TURTLE_HELMET", "IRON_TURTLE_HELMET", "GOLDEN_TURTLE_HELMET",
                "LEATHER_TURTLE_HELMET", "CHAINMAIL_TURTLE_HELMET", "NETHERITE_TURTLE_HELMET",
                "STONE_TURTLE_HELMET", "WOODEN_TURTLE_HELMET", "DIAMOND_FISHING_ROD",
                "IRON_FISHING_ROD", "GOLDEN_FISHING_ROD", "LEATHER_FISHING_ROD",
                "CHAINMAIL_FISHING_ROD", "NETHERITE_FISHING_ROD", "STONE_FISHING_ROD",
                "WOODEN_FISHING_ROD", "DIAMOND_FLINT_AND_STEEL", "IRON_FLINT_AND_STEEL",
                "GOLDEN_FLINT_AND_STEEL", "LEATHER_FLINT_AND_STEEL", "CHAINMAIL_FLINT_AND_STEEL",
                "NETHERITE_FLINT_AND_STEEL", "STONE_FLINT_AND_STEEL", "WOODEN_FLINT_AND_STEEL",
                "DIAMOND_SHEARS", "IRON_SHEARS", "GOLDEN_SHEARS", "LEATHER_SHEARS",
                "CHAINMAIL_SHEARS", "NETHERITE_SHEARS", "STONE_SHEARS", "WOODEN_SHEARS",
                "DIAMOND_CARROT_ON_A_STICK", "IRON_CARROT_ON_A_STICK", "GOLDEN_CARROT_ON_A_STICK",
                "LEATHER_CARROT_ON_A_STICK", "CHAINMAIL_CARROT_ON_A_STICK", "NETHERITE_CARROT_ON_A_STICK",
                "STONE_CARROT_ON_A_STICK", "WOODEN_CARROT_ON_A_STICK", "DIAMOND_WARPED_FUNGUS_ON_A_STICK",
                "IRON_WARPED_FUNGUS_ON_A_STICK", "GOLDEN_WARPED_FUNGUS_ON_A_STICK", "LEATHER_WARPED_FUNGUS_ON_A_STICK",
                "CHAINMAIL_WARPED_FUNGUS_ON_A_STICK", "NETHERITE_WARPED_FUNGUS_ON_A_STICK", "STONE_WARPED_FUNGUS_ON_A_STICK",
                "WOODEN_WARPED_FUNGUS_ON_A_STICK", "DIAMOND_COMPASS", "IRON_COMPASS", "GOLDEN_COMPASS",
                "LEATHER_COMPASS", "CHAINMAIL_COMPASS", "NETHERITE_COMPASS", "STONE_COMPASS", "WOODEN_COMPASS",
                "DIAMOND_SADDLE", "IRON_SADDLE", "GOLDEN_SADDLE", "LEATHER_SADDLE",
                "CHAINMAIL_SADDLE", "NETHERITE_SADDLE", "STONE_SADDLE", "WOOD"
            ];

            return materials.map(material => {
                const item = new vscode.CompletionItem(material, vscode.CompletionItemKind.Enum);
                item.detail = `Minecraft Material: ${material}`;
                item.insertText = material;
                return item;
            });
        }
    },
    " " // Kích hoạt khi nhập dấu cách sau "material:"
);


// **Gợi ý màu RGB cho `dye-color:`**
export const dyeColorProvider = vscode.languages.registerCompletionItemProvider(
    { language: "yaml", scheme: "file" },
    {
        provideCompletionItems(document, position) {
            const lineAbove = document.lineAt(position.line - 1).text.trim();
            if (!lineAbove.startsWith("dye-color:")) return [];

            const colors = [
                "255 0 0", "0 255 0", "0 0 255", "255 255 0", "255 165 0",
                "128 0 128", "0 255 255", "255 192 203", "0 128 128",
                "128 128 128", "192 192 192"
            ];

            return colors.map(color => {
                const item = new vscode.CompletionItem(color, vscode.CompletionItemKind.Color);
                item.documentation = new vscode.MarkdownString(`🎨 **Màu RGB:** \`${color}\``);
                item.insertText = new vscode.SnippetString(color);
                return item;
            });
        }
    },
    " "
);

//  **Hiển thị bảng màu ngay sau đoạn số**
export const dyeColorPresentationProvider = vscode.languages.registerColorProvider(
    { language: "yaml", scheme: "file" },
    {
        provideDocumentColors(document) {
            const colors: vscode.ColorInformation[] = [];
            const regex = /dye-color:\s*(\d+)\s+(\d+)\s+(\d+)/g;
            const text = document.getText();
            let match;

            while ((match = regex.exec(text))) {
                const [_, r, g, b] = match.map(Number);
                const color = new vscode.Color(r / 255, g / 255, b / 255, 1);
                const range = new vscode.Range(
                    document.positionAt(match.index + 10),
                    document.positionAt(match.index + match[0].length) // Chỉ tính phần số RGB
                );
                colors.push(new vscode.ColorInformation(range, color));
            }

            return colors;
        },

        provideColorPresentations(color) {
            const r = Math.round(color.red * 255);
            const g = Math.round(color.green * 255);
            const b = Math.round(color.blue * 255);
            return [new vscode.ColorPresentation(`${r} ${g} ${b}`)];
        }
    }
);



export function registerCompletionProviders(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        abilityProvider,
        enchantmentProvider,
        statsProvider,
        materialProvider,
        dyeColorProvider,
        dyeColorPresentationProvider
    );
}
