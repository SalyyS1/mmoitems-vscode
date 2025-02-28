import * as vscode from 'vscode';
import { registerPreviewCommand } from './preview';
import { registerRandomItemCommand } from './randomitem';
import { registerScaleItemCommand } from './scaleItem';
import { registerSyntaxHighlight } from './theme';
import { registerCompletionProviders, dyeColorProvider, dyeColorPresentationProvider } from './completion';
import { registerBulkModifyCommand } from './modifier';

import * as yaml from 'js-yaml';

//  **Kích hoạt Extension**
let firstRun = true; // ✅ Cờ kiểm tra lần khởi động đầu tiên
export function activate(context: vscode.ExtensionContext) {
    registerPreviewCommand(context);


    registerCompletionProviders(context);


    registerRandomItemCommand(context);


    registerScaleItemCommand(context);


    registerSyntaxHighlight(context);

    console.log("✅ MMOItems Config Helper activated!");
    context.subscriptions.forEach((sub, index) => {
        if ((sub as any)._command === "mmoitems.bulkModify") {
            context.subscriptions.splice(index, 1);
        }
    });

    // 🛠 **Đăng ký tính năng Bulk Modifier**
    registerBulkModifyCommand(context);


    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("❌ No active text editor.");
        return;
    }

    let items: Record<string, any> = {};
    try {
        const text = editor.document.getText();
        items = yaml.load(text) as Record<string, any>;
    } catch (error) {
        vscode.window.showErrorMessage(`❌ YAML error: ${error}`);
        return;
    }





    // 🌈 Đăng ký hỗ trợ màu cho `dye-color:`
    context.subscriptions.push(dyeColorProvider);
    context.subscriptions.push(dyeColorPresentationProvider);

    // 🔄 **Cập nhật bảng màu khi file thay đổi**
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "yaml") {
            vscode.commands.executeCommand("editor.action.documentColorProvider.refresh");
        }
    });
}


//  **Tắt Extension**
export function deactivate() {
    console.log("❌ MMOItems Config Helper deactivated.");
}
