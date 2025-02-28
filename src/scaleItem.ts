import * as vscode from 'vscode';
import * as yaml from 'js-yaml';

export function registerScaleItemCommand(context: vscode.ExtensionContext) {
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
    let yamlData: Record<string, any>;
    try {
        yamlData = yaml.load(text) as Record<string, any>;
        if (!yamlData || typeof yamlData !== "object") throw new Error();
    } catch {
        return vscode.window.showErrorMessage("❌ Error: Invalid YAML data!");
    }

    const itemKey = Object.keys(yamlData)[0];
    const baseStats = (yamlData[itemKey]?.base ?? {}) as Record<string, number>;
    const itemName = yamlData[itemKey]?.base?.name || "Item";
    const statsScaleFactors: Record<string, number> = {};

    for (const stat of Object.keys(baseStats)) {
        if (typeof baseStats[stat] === "number") {
            const scaleInput = await vscode.window.showInputBox({
                prompt: `Enter boost percentage for '${stat}':\n- Example: 50 = increase by 50%\n- Leave empty to keep the current value`
            });

            if (!scaleInput) {
                statsScaleFactors[stat] = 1;
            } else if (isNaN(Number(scaleInput))) {
                vscode.window.showErrorMessage(`❌ Invalid value for ${stat}`);
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
    const newYamlData: Record<string, any> = JSON.parse(JSON.stringify(yamlData));
    const baseLevel = parseInt(itemKey.match(/LV(\d+)/)?.[1] || "1", 10);

    let previousStats = JSON.parse(JSON.stringify(baseStats)) as Record<string, number>;

    for (let i = 0; i < scaleAmount; i++) {
        const newLevel = baseLevel + i + 1;
        const newItemKey = `${itemKey.split("_LV")[0]}_LV${newLevel}`;
        newYamlData[newItemKey] = JSON.parse(JSON.stringify(yamlData[itemKey]));
        const newItem = newYamlData[newItemKey].base as Record<string, any>;

        newItem.name = levelFormat.replace("%lv%", newLevel.toString()).replace("%name%", itemName);

        for (const stat in statsScaleFactors) {
            if (typeof previousStats[stat] === "number") {
                newItem[stat] = parseFloat((previousStats[stat] * statsScaleFactors[stat]).toFixed(2));
                previousStats[stat] = newItem[stat];
            }
        }
    }

    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, yaml.dump(newYamlData, { schema: yaml.JSON_SCHEMA, lineWidth: -1 }));
    });
    vscode.window.showInformationMessage(`✅ Scaled ${scaleAmount} items successfully!`);
});

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
}
