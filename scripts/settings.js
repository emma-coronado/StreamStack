const settingsBtn = document.getElementById('settings-btn');
const settingsPopup = document.getElementById('settings-popup');
const darkToggle = document.getElementById('dark-toggle');
const emptyList = document.getElementById('empty-list');
const restoreList = document.getElementById('restore-list'); // new
const listContainer = document.querySelector('.list');

// Store original list items for restoring
let originalListItems = [];

// Get all list items via messaging
async function getAllListItems() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getAllItems" }, (response) => {
      resolve(response || []);
    });
  });
}

// Initialize original list items on load
(async () => {
  originalListItems = await getAllListItems();
})();

// Toggle popup visibility
settingsBtn.addEventListener('click', () => {
  settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
});

// --- DARK MODE: check saved preference on load ---
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkToggle.checked = true;
}

// Toggle dark mode on change
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Empty the list
emptyList.addEventListener('click', () => {
  listContainer.innerHTML = '';
  document.querySelector('.item-count').textContent = '0 items';
  settingsPopup.style.display = 'none';
});

// Restore the list
restoreList.addEventListener('click', async () => {
  // Get fresh data from storage
  const items = await getAllListItems();
  
  listContainer.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.dataset.status = item.watched ? true : false;
    div.innerHTML = `
      <span class="entry-title">${item.title}</span>
      <span class="badge badge-${item.platform.toLowerCase()}">${item.platform}</span>
    `;
    listContainer.appendChild(div);
  });
  document.querySelector('.item-count').textContent = `${items.length} items`;
  settingsPopup.style.display = 'none';
});

// Optional: click outside to close popup
document.addEventListener('click', (e) => {
  if (!settingsBtn.contains(e.target) && !settingsPopup.contains(e.target)) {
    settingsPopup.style.display = 'none';
  }
});

