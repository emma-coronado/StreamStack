const landmarkClass = ".dv-node-dp-action-box"; // class of the element that our button will go after

const buttonHTML = `
  <button 
    class="btn injected-btn _1jWggM dFF2zC _3_H2aX fbl-play-btn fbl-btn _2Pw7le" 
    style="margin-top:16px"
  >
    StreamStack Placeholder
  </button>
`;

function onClick() {
    alert(document.querySelector("h1").innerText + " on Prime Video");
}

function injectAfterElement(element) {
  // Only inject once
  if (!element.nextElementSibling || !element.nextElementSibling.classList.contains("injected-btn")) {
    element.insertAdjacentHTML("afterend", buttonHTML);
    
    // add button functionality
    const btn = element.nextElementSibling;
    if (btn && btn.classList.contains("injected-btn")) {
      btn.addEventListener("click", () => {
        onClick();
      });
    }
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {
        // Case 1: the node itself is the landmark
        if (node.matches?.(landmarkClass)) {
          injectAfterElement(node);
        }
        // Case 2: the landmark exists inside the node
        const element = node.querySelector?.(landmarkClass);
        if (element) {
          injectAfterElement(element);
        }
      }
    }
  }
});

// Watch the main content area
const target = document.querySelector("#main-content") || document.body;
observer.observe(target, { childList: true, subtree: true });

// Run once on load
const initial = document.querySelector(landmarkClass);
if (initial) injectAfterElement(initial);
