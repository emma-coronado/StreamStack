const settingsBtn = document.getElementById('settings-btn');
const settingsPopup = document.getElementById('settings-popup');
const darkToggle = document.getElementById('dark-toggle');
const emptyList = document.getElementById('empty-list');
const restoreList = document.getElementById('restore-list');
const listContainer = document.querySelector('.list');
const itemCount = document.querySelector('.item-count');
const subtitle = document.querySelector('.card-header .subtitle');
const refreshBtn = document.getElementById('refresh-btn');




// Store original list items for restoring
let originalListItems = [];

// --- HELPERS ---

async function getAllListItems() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getAllItems" }, (response) => {
      resolve(response || []);
    });
  });
}

async function refreshList() {
  const items = await getAllListItems();

  listContainer.innerHTML = '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-item flex justify-between items-center';
    div.dataset.status = item.watched ? 'watched' : 'to-watch';

    const eyeSrc = item.watched ? 'icons/eye-closed.png' : 'icons/eye-open.png';

    div.innerHTML = `
      <div class="flex flex-col left-side">
        <span class="entry-title">${item.title}</span>
        <span class="badge badge-${item.platform.toLowerCase()}">${item.platform}</span>
      </div>

      <div class="right-side flex items-center gap-2">
        <img src="${eyeSrc}" alt="Toggle Watched" class="eye-icon cursor-pointer" width="24" height="24" />
        <img src="icons/remove.png" alt="Remove" class="remove-icon cursor-pointer" width="18" height="18" />
      </div>
    `;

    // Add remove functionality
    div.querySelector('.remove-icon').addEventListener('click', async () => {
      await chrome.runtime.sendMessage({
        action: "deleteItem",
        title: item.title,
        platform: item.platform
      });
      await refreshList();
    });

    listContainer.appendChild(div);
  });

  // Update counts
  const toWatchCount = items.filter(item => !item.watched).length;
  subtitle.textContent = `${toWatchCount} item${toWatchCount !== 1 ? 's' : ''} to watch`;
  itemCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
}





async function addNewItem(title, platform, watched) {
  await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "addItem", title, platform, isWatched: watched },
      resolve
    );
  });

  // Refresh the list immediately after adding
  await refreshList();
}

// --- INITIALIZATION ---

// Load list when popup opens
(async () => {
  originalListItems = await getAllListItems();
  await refreshList();
})();

settingsBtn.addEventListener('click', () => {
  settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
});

// --- DARK MODE ---

// Apply saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkToggle.checked = true;
}

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
});

// --- SETTINGS ACTIONS ---

emptyList.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: "clearAllItems" });
  await refreshList();
  settingsPopup.style.display = 'none';
});


restoreList.addEventListener('click', async () => {
  await refreshList();
  settingsPopup.style.display = 'none';
});

refreshBtn.addEventListener('click', async () => {
  await refreshList();
});

document.addEventListener('click', (e) => {
  if (!settingsBtn.contains(e.target) && !settingsPopup.contains(e.target)) {
    settingsPopup.style.display = 'none';
  }

});

document.querySelectorAll('.add-btn').forEach(button => {
  button.addEventListener('click', () => {
    const title = button.dataset.title;
    const platform = button.dataset.platform;
    addNewItem(title, platform, false); 
  });
});


// --- LIST UPDATE LISTENER ---

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'itemAdded' || message.action === 'listUpdated') {
    refreshList();
  }
});
