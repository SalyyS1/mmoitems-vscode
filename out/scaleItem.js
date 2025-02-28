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
exports.registerScaleItemCommand = void 0;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
function registerScaleItemCommand(context) {
    const scaleCommand = vscode.commands.registerCommand('mmoitems.scaleItem', () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            return vscode.window.showErrorMessage("❌ Please highlight an item before scaling.");
        }
        let levelFormat = yield vscode.window.showInputBox({
            prompt: "Enter level format:\n- Use %lv% as the level placeholder\n- Use %name% to keep the item name",
            value: "%name% &8[&eLv.%lv%&8]"
        });
        if (!levelFormat) {
            levelFormat = "%name% &8[&eLv.%lv%&8]";
        }
        const text = editor.document.getText(editor.selection);
        let yamlData;
        try {
            yamlData = yaml.load(text);
            if (!yamlData || typeof yamlData !== "object")
                throw new Error();
        }
        catch (_f) {
            return vscode.window.showErrorMessage("❌ Error: Invalid YAML data!");
        }
        const itemKey = Object.keys(yamlData)[0];
        const baseStats = ((_b = (_a = yamlData[itemKey]) === null || _a === void 0 ? void 0 : _a.base) !== null && _b !== void 0 ? _b : {});
        const itemName = ((_d = (_c = yamlData[itemKey]) === null || _c === void 0 ? void 0 : _c.base) === null || _d === void 0 ? void 0 : _d.name) || "Item";
        const statsScaleFactors = {};
        for (const stat of Object.keys(baseStats)) {
            if (typeof baseStats[stat] === "number") {
                const scaleInput = yield vscode.window.showInputBox({
                    prompt: `Enter boost percentage for '${stat}':\n- Example: 50 = increase by 50%\n- Leave empty to keep the current value`
                });
                if (!scaleInput) {
                    statsScaleFactors[stat] = 1;
                }
                else if (isNaN(Number(scaleInput))) {
                    vscode.window.showErrorMessage(`❌ Invalid value for ${stat}`);
                    return;
                }
                else {
                    statsScaleFactors[stat] = (Number(scaleInput) / 100) + 1;
                }
            }
        }
        const amountInput = yield vscode.window.showInputBox({ prompt: "Enter the number of items to scale (Example: 3)" });
        if (!amountInput || isNaN(Number(amountInput))) {
            return vscode.window.showErrorMessage("❌ Please enter a valid quantity!");
        }
        const scaleAmount = Number(amountInput);
        const newYamlData = JSON.parse(JSON.stringify(yamlData));
        const baseLevel = parseInt(((_e = itemKey.match(/LV(\d+)/)) === null || _e === void 0 ? void 0 : _e[1]) || "1", 10);
        let previousStats = JSON.parse(JSON.stringify(baseStats));
        for (let i = 0; i < scaleAmount; i++) {
            const newLevel = baseLevel + i + 1;
            const newItemKey = `${itemKey.split("_LV")[0]}_LV${newLevel}`;
            newYamlData[newItemKey] = JSON.parse(JSON.stringify(yamlData[itemKey]));
            const newItem = newYamlData[newItemKey].base;
            newItem.name = levelFormat.replace("%lv%", newLevel.toString()).replace("%name%", itemName);
            for (const stat in statsScaleFactors) {
                if (typeof previousStats[stat] === "number") {
                    newItem[stat] = parseFloat((previousStats[stat] * statsScaleFactors[stat]).toFixed(2));
                    previousStats[stat] = newItem[stat];
                }
            }
        }
        yield editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, yaml.dump(newYamlData, { schema: yaml.JSON_SCHEMA, lineWidth: -1 }));
        });
        vscode.window.showInformationMessage(`✅ Scaled ${scaleAmount} items successfully!`);
    }));
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
exports.registerScaleItemCommand = registerScaleItemCommand;
