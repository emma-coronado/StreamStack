// scripts/netflix.js — inject to the RIGHT of the thumbs button (precise selectors)
console.log("[StreamStack] netflix content script loaded");

// Precise selectors from your DOM
const THUMBS_SELECTOR =
  '.previewModal--player-container [data-uia="mini-modal-controls"] button[data-uia="thumbs-rate-button"]';

const BUTTON_HTML = `
  <button class="injected-btn"
    style="
      margin-left:8px; margin-right:8px;
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      height:48px; padding:0 18px; border:0; border-radius:6px;
      background:#fff; color:#000; font-weight:700; font-size:16px;
      cursor:pointer; box-shadow:0 1px 0 rgba(0,0,0,0.2);
      vertical-align:top;
    ">
    Add to StreamStack
  </button>
`;

function getNetflixTitle() {
  console.log("[StreamStack] Netflix: Extracting title...");
  // Get title from preview modal boxart image
  const boxartImg = document.querySelector('.previewModal--boxart');
  if (boxartImg) {
    const altText = boxartImg.getAttribute('alt')?.trim();
    if (altText && altText.length > 0) {
      console.log("[StreamStack] Netflix: Found title:", altText);
      return altText;
    }
  }
}

function onClick(btn) {
  const title = getNetflixTitle() || "Unknown Title";
  console.log("[StreamStack] Netflix: Adding title:", title);
  // alert(`${title} on Netflix`);

  chrome.runtime.sendMessage({
            action: "addItem",
            title: title,
            platform: "Netflix",
            isWatched: false
        }, response => {
            console.log(response);
        });

  // chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {    
  //   // Create item with title and platform
  //   const item = {
  //     title: title,
  //     platform: "Netflix"
  //   };
    
  //   // Check if title already exists (case insensitive)
  //   const exists = streamstack.some(existing => 
  //     existing.title && existing.title.toLowerCase() === title.toLowerCase()
  //   );
    
  //   if (!exists) {
  //     streamstack.push(item);
  //     console.log("[StreamStack] Netflix: Updated streamstack:", streamstack);
  //     chrome.storage.local.set({ streamstack }, () => {
  //       console.log("[StreamStack] Netflix: Storage updated successfully");
  //     });
  //   } else {
  //     console.log("[StreamStack] Netflix: Title already exists in streamstack");
  //   }
  // });

  if (btn) {
    btn.textContent = "Added";
    btn.style.opacity = "0.9";
  }
}

function injectRightOfThumbs(root = document) {
  const thumbs = root.querySelector(THUMBS_SELECTOR) || document.querySelector(THUMBS_SELECTOR);
    
  if (!thumbs) {
    // console.log("[StreamStack] Thumbs button not found, trying alternative selectors...");
    
    // Try alternative selectors
    const altSelectors = [
      'button[data-uia="thumbs-rate-button"]',
      '.previewModal--player-container button',
      '[data-uia="mini-modal-controls"] button',
      'button[aria-label*="thumbs"]'
    ];
    
    for (const selector of altSelectors) {
      const altThumbs = document.querySelector(selector);
      if (altThumbs) {
        // console.log("[StreamStack] Found alternative thumbs button with selector:", selector);
        return injectButton(altThumbs);
      }
    }
    
    // console.log("[StreamStack] No thumbs button found with any selector");
    return false;
  }
  
  return injectButton(thumbs);
}

function injectButton(thumbs) {
  const sib = thumbs.nextElementSibling;
  if (sib && sib.classList?.contains('injected-btn')) return true; // already injected

  // Ensure the parent container has proper flex layout for horizontal alignment
  const parent = thumbs.parentElement;
  if (parent) {
    const computedStyle = window.getComputedStyle(parent);
    if (computedStyle.display !== 'flex' && computedStyle.display !== 'inline-flex') {
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.gap = '8px';
    }
  }

  thumbs.insertAdjacentHTML('afterend', BUTTON_HTML);
  const btn = thumbs.nextElementSibling;
  if (btn && btn.classList.contains('injected-btn')) {
    btn.addEventListener('click', () => onClick(btn));
    console.log("[StreamStack] Successfully injected button next to thumbs button");
  }
  return true;
}

function scanAndInject(root = document) {
  const success = injectRightOfThumbs(root);
  
  if (!success) {
    console.log("[StreamStack] Thumbs injection failed, trying fallback injection...");
    return injectFallback();
  }
  
  return success;
}

function injectFallback() {
  // Try to inject into the main content area
  const containers = [
    '.previewModal--player-container',
    '.player-controls',
    '.video-player',
    'main',
    'body'
  ];
  
  for (const containerSelector of containers) {
    const container = document.querySelector(containerSelector);
    if (container) {
      console.log("[StreamStack] Trying fallback injection in:", containerSelector);
      
      // Check if button already exists
      if (container.querySelector('.injected-btn')) {
        console.log("[StreamStack] Button already exists in fallback container");
        return true;
      }
      
      // Inject button
      container.insertAdjacentHTML('beforeend', BUTTON_HTML);
      const btn = container.querySelector('.injected-btn');
      if (btn) {
        btn.addEventListener('click', () => onClick(btn));
        console.log("[StreamStack] Successfully injected button via fallback method");
        return true;
      }
    }
  }
  console.log("[StreamStack] All injection methods failed");
  return false;
}

// Observe SPA/modal changes
const mo = new MutationObserver(muts => {
  for (const m of muts) {
    for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (scanAndInject(node)) return;
    }
  }
});
mo.observe(document.body, { childList: true, subtree: true });

// Initial pass
scanAndInject();
