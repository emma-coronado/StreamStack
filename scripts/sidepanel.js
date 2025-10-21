const listEl = document.getElementById("ss-list");

function render() {
  console.log("[StreamStack] Sidepanel: Rendering...");
  chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
    console.log("[StreamStack] Sidepanel: Current streamstack:", streamstack);
    listEl.innerHTML = "";
    streamstack.forEach((item, i) => {
      console.log("[StreamStack] Sidepanel: Rendering item:", item, "at index:", i);
      const li = document.createElement("li");
      li.style.padding = "8px 0";
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.borderBottom = "1px solid #eee";

      const content = document.createElement("div");
      content.style.display = "flex";
      content.style.flexDirection = "column";
      content.style.gap = "4px";

      const title = document.createElement("span");
      title.textContent = item.title || item; // Handle both old format (string) and new format (object)
      title.style.fontWeight = "500";

      const platform = document.createElement("span");
      platform.textContent = item.platform || "Unknown Platform";
      platform.style.fontSize = "12px";
      platform.style.color = "#666";
      platform.style.fontWeight = "400";

      content.appendChild(title);
      content.appendChild(platform);

      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.dataset.index = String(i);
      btn.style.marginLeft = "12px";
      btn.style.padding = "4px 8px";
      btn.style.fontSize = "12px";

      li.appendChild(content);
      li.appendChild(btn);
      listEl.appendChild(li);
    });
    console.log("[StreamStack] Sidepanel: Render complete, items count:", streamstack.length);
  });
}

// event delegation for all remove buttons
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || btn.dataset.index == null) return;

  const idx = Number(btn.dataset.index);
  chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
    if (idx >= 0 && idx < streamstack.length) {
      streamstack.splice(idx, 1);
      chrome.storage.local.set({ streamstack });
    }
  });
});

// initial render + live updates
render();
chrome.storage.onChanged.addListener((changes, area) => {
  console.log("[StreamStack] Sidepanel: Storage changed:", changes, "area:", area);
  if (area === "local" && changes.streamstack) {
    console.log("[StreamStack] Sidepanel: Streamstack changed, re-rendering...");
    render();
  }
});
