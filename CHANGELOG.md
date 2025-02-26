


# 📜 MMOItems Config Helper - Changelog

---


## 🆕 Version 1.0.6 - (2025-02-26)
### 🚀 Improvements & Fixes
- **Scale Item Enhancements**:
  - Now supports **custom scaling percentages** for each stat.
  - **Retains original item** and creates scaled versions instead of modifying the base item.
  - Improved **leveling logic**, ensuring correct item progression.
  - Default **name formatting** now adds `%name% &8[&eLv.%lv%&8]` if no format is specified.
- **Enhanced HexColor & RGB Support**:
  - Full **Minecraft color code support** (`&x&F&1&F&6&9&C`, `&#084CFB`, `<gradient:#084CFB:#ADF3FD>`, etc.).
  - Now **supports mixing multiple color formats in a single line**.
  - Improved compatibility with MMOItems plugin.
- **Better Auto-Completion**:
  - **Enchantments Auto-Suggest**: Only triggers when inside `enchantments` section.
  - **Ability Auto-Suggest**: Activates when inside an `ability` section.
  - **Stat Auto-Suggest**: No longer appears when suggesting enchantments or abilities.
- **General Fixes**:
  - Fixed **formatting errors** in YAML output.
  - Fixed issue with **nested ability scaling**.
  - **Improved preview UI** for better readability.



---


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
