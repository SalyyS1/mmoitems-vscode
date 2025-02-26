window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "updatePreview") {
        document.getElementById("preview").innerHTML = generateItemPreview(message.data);
    }
});

function generateItemPreview(data) {
    let content = "";
    for (const key in data) {
        if (data[key]?.base) {
            const item = data[key].base;
            const material = item.material || "UNKNOWN";
            const materialIconUrl = `https://minecraft.wiki/images/${material}.png`;

            content += `
                <div class="tooltip">
                    <div class="title">
                        <img src="${materialIconUrl}" class="material-icon" onerror="this.style.display='none'">
                        ${item.name || "Unnamed Item"}
                    </div>
                    <div class="stat"><strong>🔹 Material:</strong> ${material}</div>
                    <div class="tier">Tier: ${item.tier || "Unknown"}</div>
                    <div class="separator"></div>
            `;

            if (Array.isArray(item.lore)) {
                content += `<div class="lore">${item.lore.join('<br>')}</div>`;
            } else if (typeof item.lore === "string") {
                content += `<div class="lore">${item.lore}</div>`;
            }

            content += '<div class="separator"></div>';

            for (const stat in item) {
                if (statMappings[stat]) {
                    content += `<div class="stat">${statMappings[stat].icon} ${statMappings[stat].display}: ${item[stat]}</div>`;
                }
            }

            content += '<div class="separator"></div>';

            if (item.enchantments) {
                content += `<div class="enchant">🔮 <strong>Enchantments:</strong></div>`;
                for (const enchant in item.enchantments) {
                    content += `<div class="enchant">- ${enchant} ${item.enchantments[enchant]}</div>`;
                }
            }

            content += '</div><br>';
        }
    }
    return content || "<p>No valid item found.</p>";
}
