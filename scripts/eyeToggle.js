document.addEventListener("DOMContentLoaded", () => {
  const eyeIcons = document.querySelectorAll(".eye-icon");

  eyeIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      // Toggle watched/unwatched
      if (icon.src.includes("icons/eye-open.png")) {
        icon.src = "icons/eye-closed.png";
        icon.closest(".list-item").dataset.status = "watched";
      } else {
        icon.src = "icons/eye-open.png";
        icon.closest(".list-item").dataset.status = "to-watch";
      }
    });
  });
});
