document.addEventListener("DOMContentLoaded", () => {
    const eyeIcons = document.querySelectorAll(".eye-icon");
  
    eyeIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        if (icon.src.includes("eye-open.png")) {
          icon.src = "eye-closed.png";
          icon.closest(".list-item").dataset.status = "watched";
        } else {
          icon.src = "eye-open.png";
          icon.closest(".list-item").dataset.status = "to-watch";
        }
      });
    });
  });
  