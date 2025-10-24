document.addEventListener("click", (event) => {
  if (event.target.classList.contains("eye-icon")) {
    const icon = event.target;
    const listItem = icon.closest(".list-item");

    // Toggle icon and dataset
    if (icon.src.includes("icons/eye-open.png")) {
      icon.src = "icons/eye-closed.png";
      listItem.dataset.status = "watched";
    } else {
      icon.src = "icons/eye-open.png";
      listItem.dataset.status = "to-watch";
    }

    // restore toggle status when list is restored
    const title = listItem.querySelector(".entry-title").textContent;
    chrome.runtime.sendMessage({
      action: "toggleWatched",
      title,
      watched: listItem.dataset.status === "watched"
    });
  }
});
