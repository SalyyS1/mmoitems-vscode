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
exports.registerCompareItemsCommand = void 0;
const vscode = __importStar(require("vscode"));
const yaml = __importStar(require("js-yaml"));
// ✅ Đăng ký lệnh so sánh vật phẩm
function registerCompareItemsCommand(context) {
    context.subscriptions.push(vscode.commands.registerCommand("mmoitems.compareItems", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("❌ No YAML file is open.");
            return;
        }
        const items = parseYamlSelection(editor);
        if (items)
            createComparisonWebview(context, items);
    }));
}
exports.registerCompareItemsCommand = registerCompareItemsCommand;
// ✅ Hàm lấy YAML từ vùng chọn
function parseYamlSelection(editor) {
    if (editor.selection.isEmpty) {
        vscode.window.showErrorMessage("❌ Please highlight one or more items.");
        return null;
    }
    try {
        const text = editor.document.getText(editor.selection);
        return yaml.load(text);
    }
    catch (error) {
        vscode.window.showErrorMessage("❌ Error: Invalid YAML format!");
        return null;
    }
}
// ✅ Tạo WebView so sánh vật phẩm
function createComparisonWebview(context, items) {
    const panel = vscode.window.createWebviewPanel("mmoItemComparison", "MMOItems Comparison", vscode.ViewColumn.Beside, { enableScripts: true });
    const keys = Object.keys(items);
    let properties = new Set();
    keys.forEach(key => {
        var _a;
        if ((_a = items[key]) === null || _a === void 0 ? void 0 : _a.base) {
            Object.keys(items[key].base).forEach(prop => properties.add(String(prop)));
        }
    });
    let comparisonHtml = `
        <style>
            body { font-family: Arial, sans-serif; background: #222; color: #fff; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #444; padding: 10px; text-align: left; }
            th { background: #333; cursor: pointer; }
            tr:nth-child(even) { background: #333; }
            .filter-section { margin-bottom: 10px; }
            .bar { height: 10px; background: #4CAF50; margin-top: 4px; }
        </style>
        <h1>Item Comparison</h1>

        <div class="filter-section">
            <label><input type="checkbox" id="showDiff" checked> 🔍 Chỉ hiện khác biệt</label>
            <button onclick="exportData()">📄 Xuất dữ liệu</button>
        </div>

        <table id="comparisonTable">
        <tr><th>📌 Property</th>`;
    keys.forEach(item => (comparisonHtml += `<th>${convertColorTags(String(item))}</th>`));
    comparisonHtml += `</tr>`;
    properties.forEach(prop => {
        comparisonHtml += `<tr><td>${convertColorTags(String(prop))}</td>`;
        keys.forEach(key => {
            var _a, _b, _c;
            let value = (_c = (_b = (_a = items[key]) === null || _a === void 0 ? void 0 : _a.base) === null || _b === void 0 ? void 0 : _b[prop]) !== null && _c !== void 0 ? _c : "";
            let formattedValue = typeof value === "number"
                ? `<div>${value}</div><div class="bar" style="width: ${value * 5}px;"></div>`
                : convertColorTags(String(value));
            comparisonHtml += `<td>${formattedValue}</td>`;
        });
        comparisonHtml += `</tr>`;
    });
    comparisonHtml += `</table>

    <script>
        document.getElementById("showDiff").addEventListener("change", function() {
            let rows = document.querySelectorAll("#comparisonTable tr");
            for (let i = 1; i < rows.length; i++) {
                let values = [];
                rows[i].querySelectorAll("td:not(:first-child)").forEach(td => values.push(td.innerText.trim()));
                let uniqueValues = new Set(values);
                rows[i].style.display = (this.checked && uniqueValues.size === 1) ? "none" : "";
            }
        });

        function exportData() {
            let data = document.querySelector("table").outerHTML;
            navigator.clipboard.writeText(data);
            alert("📄 Bảng so sánh đã được sao chép!");
        }
    </script>
    `;
    panel.webview.html = comparisonHtml;
}
// ✅ Chuyển đổi màu sắc cho chuỗi có mã màu Minecraft & MiniMessage
function convertColorTags(text) {
    if (!text)
        return text;
    // ✅ Chuyển đổi HEX dạng `&#084CFBText`
    text = text.replace(/&#([0-9a-fA-F]{6})/g, `<span style="color:#$1">`);
    text = text.replace(/<#([0-9a-fA-F]{6})>(.*?)</g, `<span style="color:#$1">$2</span>`);
    text = text.replace(/\[COLOR=#([0-9a-fA-F]{6})\](.*?)\[\/COLOR\]/g, `<span style="color:#$1">$2</span>`);
    text = text.replace(/<##([0-9a-fA-F]{6})>(.)/g, `<span style="color:#$1">$2</span>`);
    text = text.replace(/§x(§[0-9a-fA-F]){6}/g, match => {
        let hex = match.replace(/§x|§/g, "");
        return `<span style="color:#${hex}">`;
    });
    // ✅ Chuyển đổi mã màu kiểu `&x&F&1&F&6&9&C` từng ký tự một
    text = text.replace(/&x((&[0-9a-fA-F]){6})/g, match => {
        let hex = match.replace(/&x|&/g, "");
        return `<span style="color:#${hex}">`;
    });
    // ✅ Hỗ trợ các format &l, &n, &m, &o, &k, &r
    text = text.replace(/&([lmnork])/g, (_, code) => {
        switch (code) {
            case "l": return `<span style="font-weight:bold">`; // **In đậm**
            case "n": return `<span style="text-decoration:underline">`; // _Gạch chân_
            case "m": return `<span style="text-decoration:line-through">`; // ~~Gạch ngang~~
            case "o": return `<span style="font-style:italic">`; // *Chữ nghiêng*
            case "k": return `<span class="random-text">`; // 🔀 Ký tự ngẫu nhiên
            case "r": return `</span>`; // 🔄 Reset
            default: return `&${code}`;
        }
    });
    // ✅ Đóng `<span>` bị mở nhưng chưa đóng
    const openTags = (text.match(/<span/g) || []).length;
    const closeTags = (text.match(/<\/span>/g) || []).length;
    if (openTags > closeTags) {
        text += "</span>".repeat(openTags - closeTags);
    }
    return text;
}
