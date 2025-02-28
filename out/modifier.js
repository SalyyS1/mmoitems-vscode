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
exports.registerBulkModifyCommand = void 0;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
// 🛠 **Đăng ký lệnh chỉnh sửa hàng loạt**
function registerBulkModifyCommand(context) {
    if (context.subscriptions.some(sub => sub._command === "mmoitems.bulkModify")) {
        return;
    }
    const command = vscode.commands.registerCommand("mmoitems.bulkModify", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No YAML file is open.");
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage("❌ Please highlight the stats you want to modify.");
            return;
        }
        const selectedText = editor.document.getText(selection);
        let selectedData;
        try {
            selectedData = yaml.load(selectedText);
            if (!selectedData || typeof selectedData !== "object")
                throw new Error();
        }
        catch (_a) {
            vscode.window.showErrorMessage("❌ Invalid YAML selection.");
            return;
        }
        createBulkModifyWebview(context, selectedData, editor, selection);
    });
    context.subscriptions.push(vscode.commands.registerCommand("mmoitems.bulkModify", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No YAML file is open.");
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showErrorMessage("❌ Please highlight the stats you want to modify.");
            return;
        }
        const selectedText = editor.document.getText(selection);
        let selectedData;
        try {
            selectedData = yaml.load(selectedText);
            if (!selectedData || typeof selectedData !== "object")
                throw new Error();
        }
        catch (_a) {
            vscode.window.showErrorMessage("❌ Invalid YAML selection.");
            return;
        }
        createBulkModifyWebview(context, selectedData, editor, selection);
    }));
}
exports.registerBulkModifyCommand = registerBulkModifyCommand;
// 🖼️ **Tạo giao diện chỉnh sửa**
function createBulkModifyWebview(context, selectedData, editor, selection) {
    const panel = vscode.window.createWebviewPanel("bulkModifier", "Bulk Item Modifier", vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = `
        <style>
            body { font-family: Arial, sans-serif; background: #1e1e1e; color: #fff; padding: 20px; }
            .container { background: #252525; padding: 20px; border-radius: 8px; text-align: center; }
            h1 { color: #ffcc00; margin-bottom: 10px; font-size: 1.4em; }
            label, input, button { display: block; margin: 10px auto; text-align: center; }
            input { width: 100%; padding: 10px; font-size: 1em; border-radius: 6px; border: none; background: #333; color: #fff; }
            button { width: 100%; background: #ffcc00; border: none; padding: 12px; font-size: 1.1em; cursor: pointer; border-radius: 6px; font-weight: bold; }
            button:hover { background: #e6b800; }
        </style>
        <div class="container">
            <h1>Modify Stats</h1>
            <label>Enter modification (+, -, *, /, %) followed by value</label>
            <input type="text" id="modifier" placeholder="e.g., +10, *1.2, -5%"/>
            <button onclick="applyModification()">Apply</button>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            function applyModification() {
                const modifier = document.getElementById('modifier').value;
                vscode.postMessage({ command: 'modify', value: modifier });
            }
        </script>
    `;
    panel.webview.onDidReceiveMessage((message) => {
        if (message.command === "modify") {
            const operation = message.value.match(/([+\-*/%])\s*(\d+(\.\d+)?%?)/);
            if (!operation) {
                vscode.window.showErrorMessage("❌ Invalid format! Use +, -, *, /, or % followed by a number.");
                return;
            }
            let op = operation[1];
            let val = parseFloat(operation[2].replace("%", "")) / (operation[2].includes("%") ? 100 : 1);
            // ✅ Chỉ sửa đổi giá trị số, giữ nguyên các phần tử khác
            Object.keys(selectedData).forEach((item) => {
                var _a;
                if (!((_a = selectedData[item]) === null || _a === void 0 ? void 0 : _a.base))
                    return;
                Object.keys(selectedData[item].base).forEach((stat) => {
                    let originalValue = selectedData[item].base[stat];
                    if (typeof originalValue === "number") {
                        switch (op) {
                            case "+":
                                selectedData[item].base[stat] = Math.round((originalValue + val * (val < 1 ? originalValue : 1)) * 100) / 100;
                                break;
                            case "-":
                                selectedData[item].base[stat] = Math.round((originalValue - val * (val < 1 ? originalValue : 1)) * 100) / 100;
                                break;
                            case "*":
                                selectedData[item].base[stat] = Math.round(originalValue * val * 100) / 100;
                                break;
                            case "/":
                                if (val !== 0)
                                    selectedData[item].base[stat] = Math.round((originalValue / val) * 100) / 100;
                                break;
                            case "%":
                                selectedData[item].base[stat] = Math.round(originalValue * (1 + val) * 100) / 100;
                                break;
                        }
                    }
                    else {
                        // ✅ Giữ nguyên giá trị không phải số (material, dye-color, enchantments...)
                        selectedData[item].base[stat] = originalValue;
                    }
                });
            });
            const newYaml = dumpYamlWithoutQuotes(selectedData);
            editor.edit((editBuilder) => {
                editBuilder.replace(selection, newYaml);
            });
            vscode.window.showInformationMessage("✅ Stats modified successfully!");
            panel.dispose();
        }
    });
}
// ✅ **Xuất YAML mà không thêm dấu ngoặc kép**
function dumpYamlWithoutQuotes(data) {
    return yaml.dump(data, {
        schema: yaml.JSON_SCHEMA,
        styles: {
            "!!int": "decimal",
            "!!float": "decimal",
        },
        lineWidth: -1,
    });
}
