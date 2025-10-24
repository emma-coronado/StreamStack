document.addEventListener("click", (event) => {
  if (event.target.classList.contains("eye-icon")) {
    const icon = event.target;
    const listItem = icon.closest(".list-item");

    if (icon.src.includes("icons/eye-open.png")) {
      icon.src = "icons/eye-closed.png";
      listItem.dataset.status = "watched";
    } else {
      icon.src = "icons/eye-open.png";
      listItem.dataset.status = "to-watch";
    }

    const title = listItem.querySelector(".entry-title").textContent;
    const platform = listItem.querySelector(".badge").textContent; 

    chrome.runtime.sendMessage({
      action: "toggleWatched",
      title,
      platform,
      watched: listItem.dataset.status === "watched"
    });
  }
});
