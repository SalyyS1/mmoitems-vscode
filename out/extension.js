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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const preview_1 = require("./preview");
const randomitem_1 = require("./randomitem");
const scaleItem_1 = require("./scaleItem");
const theme_1 = require("./theme");
const completion_1 = require("./completion");
const modifier_1 = require("./modifier");
const yaml = __importStar(require("js-yaml"));
//  **Kích hoạt Extension**
let firstRun = true; // ✅ Cờ kiểm tra lần khởi động đầu tiên
function activate(context) {
    (0, preview_1.registerPreviewCommand)(context);
    (0, completion_1.registerCompletionProviders)(context);
    (0, randomitem_1.registerRandomItemCommand)(context);
    (0, scaleItem_1.registerScaleItemCommand)(context);
    (0, theme_1.registerSyntaxHighlight)(context);
    console.log("✅ MMOItems Config Helper activated!");
    context.subscriptions.forEach((sub, index) => {
        if (sub._command === "mmoitems.bulkModify") {
            context.subscriptions.splice(index, 1);
        }
    });
    // 🛠 **Đăng ký tính năng Bulk Modifier**
    (0, modifier_1.registerBulkModifyCommand)(context);
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("❌ No active text editor.");
        return;
    }
    let items = {};
    try {
        const text = editor.document.getText();
        items = yaml.load(text);
    }
    catch (error) {
        vscode.window.showErrorMessage(`❌ YAML error: ${error}`);
        return;
    }
    // 🌈 Đăng ký hỗ trợ màu cho `dye-color:`
    context.subscriptions.push(completion_1.dyeColorProvider);
    context.subscriptions.push(completion_1.dyeColorPresentationProvider);
    // 🔄 **Cập nhật bảng màu khi file thay đổi**
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "yaml") {
            vscode.commands.executeCommand("editor.action.documentColorProvider.refresh");
        }
    });
}
exports.activate = activate;
//  **Tắt Extension**
function deactivate() {
    console.log("❌ MMOItems Config Helper deactivated.");
}
exports.deactivate = deactivate;
