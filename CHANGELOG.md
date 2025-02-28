


# 📜 MMOItems Config Helper - Changelog
---


## 🆕 Version 1.1.0 - (2025-02-28)
### 🚀 **New Features & Enhancements**

- **🎨 Dye-Color Picker Upgrade**:
  - Now displays a **color preview** next to the RGB values (`100 100 100 {color}`) for better visualization.
  - Selecting a color **only replaces the RGB values**, keeping `dye-color:` intact.

- **🛠 Material Auto-Completion Fixes**:
  - Now properly **suggests materials** when typing `material:` without interfering with stats or other fields.
  - Updated material list to **include all blocks & items** up to **Minecraft 1.21**.

- **📊 Bulk Modifier Fixes & Improvements**:
  - **Fixed unintended execution** of `Bulk Modify` when first launching the extension.
  - Users can now **batch modify item stats more reliably** without YAML formatting issues.

- **🌈 Improved MiniMessage & Hex Color Formatting**:
  - Now correctly applies **bold, underline, italic, and strikethrough** (`&l`, `&n`, `&o`, `&m`) even when combined with colors.
  - Improved handling of **gradient colors** (`<#FF0000>Text<#00FF00>`) and **Minecraft’s `§x` color codes**.

- **🚀 Performance Optimizations**:
  - Faster **stat & enchantment auto-completion**.
  - Improved YAML parsing efficiency for **large MMOItems configurations**.

- **🐞 Bug Fixes**:
  - Fixed **color picker not showing on some setups**.
  - Fixed **completion items not appearing after initial activation**.
  - Various **stability improvements** in preview rendering.

🔥 **MMOItems Config Helper** is now more **stable, accurate, and feature-rich than ever!** 🚀



---


## 🆕 Version 1.0.9 - (2025-02-27)
### 🚀 Improvements & Fixes
- **Added Item Comparison**: Compare multiple items side-by-side to analyze differences in stats.
- **Batch Stat Editing**: Update multiple item stats at once, saving time for mass modifications.
- **Syntax Highlighting Enhancements**: Improved visibility for key MMOItems elements in YAML.
- **Minecraft Font Support**: Added support for Minecraft-style fonts in previews.
- **Optimized Performance**: Improved response times when loading and editing YAML files.
- **Bug Fixes & Stability Improvements**: Resolved minor issues in template management and syntax highlighting.



---


## 🆕 Version 1.0.8 - (2025-02-27)
### 🚀 Improvements & Fixes
- **Change logo**: Stella -> MMOITEMS.



---


## 🆕 Version 1.0.7 - (2025-02-27)
### 🚀 Improvements & Fixes
- **Translate**: Vi -> En.



---


## 🆕 Version 1.0.6 - (2025-02-27)
### 🚀 Improvements & Fixes
- **Scale Item Enhancements**: (Supports custom scaling percentages for each stat, retains the original item and creates scaled versions instead of modifying the base item, improved leveling logic for correct item progression, and default name formatting added as `%name% &8[&eLv.%lv%&8]` if no format is specified.)

- **Enhanced HexColor & RGB Support**: (Full Minecraft color code support (`&x&F&1&F&6&9&C`, `&#084CFB`, `<gradient:#084CFB:#ADF3FD>`, etc.), supports mixing multiple color formats in a single line, improved compatibility with the MMOItems plugin.)

- **Better Auto-Completion**: (Enchantments Auto-Suggest now triggers only inside the `enchantments` section, Ability Auto-Suggest activates inside an `ability` section, Stat Auto-Suggest no longer appears for enchantments or abilities.)

### 🔧 General Fixes
- **Fixed Formatting Issues**: (Resolved YAML formatting errors in output.)

- **Nested Ability Scaling Fix**: (Fixed issues with nested ability scaling.)

- **Preview UI Enhancements**: (Improved the preview UI for better readability and clarity.)



---


## 🆕 Version 1.0.4 - (2025-02-25)
### 🚀 Improvements & Fixes
- **Optimaze**: Reduce 80mb -> ~2mb.


---


## 🆕 Version 1.0.3 - (2025-02-25)
### 🚀 Improvements & Fixes
- **Optimaze**: Reduce 80mb -> ~2mb.


---


## 🆕 Version 1.0.2 - (2025-02-25)
### 🚀 Improvements & Fixes
- **Fixed YAML formatting**: Now values in stats and abilities no longer have unnecessary quotes (`""`).
- **Enhanced scaling system**: Scaled items now retain correct attributes and level properly.
- **Expanded enchantments & abilities**: Added all possible enchantments and abilities from MMOItems.
- **Auto-completion improvements**: Improved suggestions for stats, enchantments, and abilities.
- **Performance optimizations**: Reduced unnecessary processing and improved command execution.


---


## 🆕 Version 1.0.1 - (2025-02-25)
### 🚀 Improvements & Fixes
- **Test**: Test version.


---

## 🔥 Version 1.0.0 - (Initial Release)
### 🎉 Features
- **Auto-complete MMOItems stats** for Weapons, Armor, Consumables, RPG Items.
- **Generate random items** with tier, enchantments, and abilities.
- **Preview items** in a Minecraft-style tooltip within VS Code.
- **Scale items by level**, increasing stats dynamically.
- **Suggest MMOItems enchantments** when defining an item's properties.
- **Proper YAML formatting** with no syntax errors.

---

### 🛠️ How to Update?
1️⃣ Open **VS Code**
2️⃣ Go to **Extensions (`Ctrl+Shift+X`)**
3️⃣ Search for **`MMOItems Config Helper`**
4️⃣ Click **Update** if available 🎉

Alternatively, run the command:

ext update salyyy.mmoitems-config-helper


For feedback or issues, join our **[Discord Community](https://discord.gg/pbkAuDsAuj)** 🚀
