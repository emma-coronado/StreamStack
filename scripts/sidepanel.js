const listEl = document.getElementById("ss-list");
const searchInput = document.getElementById("search-input");
const headerCountEl = document.getElementById("item-count");
const footerCountEl = document.getElementById("footer-item-count");

// Main render function
function render() {
  chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
    // Clear existing list
    listEl.innerHTML = "";

    streamstack.forEach((item, i) => {
      // List item container
      const li = document.createElement("li");
      li.className = "list-item";

      // Entry content container
      const content = document.createElement("div");
      content.className = "entry-content";

      // Left side: title + platform badge
      const leftSide = document.createElement("div");
      leftSide.className = "left-side";

      // Title
      const title = document.createElement("span");
      title.className = "entry-title";
      title.textContent = item.title || item;
      leftSide.appendChild(title);

      // Platform badge
      if (item.platform) {
        const badge = document.createElement("span");
        badge.className = "badge";

        switch (item.platform.toLowerCase()) {
          case "netflix":
            badge.classList.add("badge-netflix");
            break;
          case "prime":
            badge.classList.add("badge-prime");
            break;
          case "peacock":
            badge.classList.add("badge-peacock");
            break;
        }

        badge.textContent = item.platform;
        leftSide.appendChild(badge);
      }

      content.appendChild(leftSide);

      // Right side: Remove button
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.dataset.index = String(i);
      btn.className = "settings";
      content.appendChild(btn);

      li.appendChild(content);
      listEl.appendChild(li);
    });

    // Update header/footer item counts
    const count = streamstack.length;
    headerCountEl.textContent = `${count} item${count !== 1 ? 's' : ''} to watch`;
    footerCountEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;
  });
}

// Event delegation for remove buttons
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

// Search input filtering
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const items = listEl.querySelectorAll(".list-item");
  items.forEach(item => {
    const title = item.querySelector(".entry-title").textContent.toLowerCase();
    item.style.display = title.includes(query) ? "flex" : "none";
  });
});

// Initial render + live updates
render();
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.streamstack) {
    render();
  }
});
