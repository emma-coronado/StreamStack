const landmarkClass = ".dv-node-dp-action-box"; // class of the element that our button will go after

const buttonHTML = `
  <button 
    class="btn injected-btn _1jWggM dFF2zC _3_H2aX fbl-play-btn fbl-btn _2Pw7le" 
    style="margin-top:16px"
  >
    Add To StreamStack
  </button>
`;

function getPrimeTitle() {
  const h1 = document.querySelector("h1");
  const text = h1?.innerText?.trim();
  if (text) return text;

  const imgAlt = h1?.querySelector('img[alt]')?.getAttribute('alt');
  if (imgAlt) return imgAlt.trim();

  const og = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  if (og) return og.trim();

  return document.title.replace(/\s+\|.+$/, "").trim();
}

function onClick(btn) {
  const title = getPrimeTitle() || "Unknown Title";
  console.log("[StreamStack] Prime: Adding title:", title);
  alert(`${title} on Prime Video`);

  chrome.runtime.sendMessage({
            action: "addItem",
            title: title,
            platform: "Prime",
            isWatched: false
        }, response => {
            console.log(response);
        });

  // chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
  //   console.log("[StreamStack] Prime: Current streamstack:", streamstack);
    
  //   // Create item with title and platform
  //   const item = {
  //     title: title,
  //     platform: "Prime Video"
  //   };
    
  //   // Check if title already exists (case insensitive)
  //   const exists = streamstack.some(existing => 
  //     existing.title && existing.title.toLowerCase() === title.toLowerCase()
  //   );
    
  //   if (!exists) {
  //     streamstack.push(item);
  //     console.log("[StreamStack] Prime: Updated streamstack:", streamstack);
  //     chrome.storage.local.set({ streamstack }, () => {
  //       console.log("[StreamStack] Prime: Storage updated successfully");
  //     });
  //   } else {
  //     console.log("[StreamStack] Prime: Title already exists in streamstack");
  //   }
  // });

  // quick visual feedback
  if (btn) {
    btn.textContent = "Added";
    btn.style.opacity = "0.9";
  }
}
function injectAfterElement(element) {
  // Only inject once
  if (!element.nextElementSibling || !element.nextElementSibling.classList.contains("injected-btn")) {
    element.insertAdjacentHTML("afterend", buttonHTML);
    
    // add button functionality
    const btn = element.nextElementSibling;
    if (btn && btn.classList.contains("injected-btn")) {
      btn.addEventListener("click", () => {
        onClick(btn);
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
