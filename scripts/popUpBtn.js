// Reference DOM elements
const listContainer = document.querySelector('.list');
const subtitle = document.querySelector('.subtitle');
const footerCount = document.querySelector('.item-count');

// Load items from storage and render with your styling
function render() {
  chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
    listContainer.innerHTML = '';

    streamstack.forEach(({ title, platform, status }) => {
      const platformClass = platform.toLowerCase().replace(/\s/g, '-');
      const div = document.createElement('div');
      div.classList.add('list-item');
      div.dataset.status = status || 'to-watch';
      div.innerHTML = `
        <div class="entry-content">
          <div class="left-side">
            <span class="entry-title">${title}</span>
            <span class="badge badge-${platformClass}">${platform}</span>
          </div>
          <img src="icons/eye-${status === 'watched' ? 'closed' : 'open'}.png" alt="Toggle Watched" class="eye-icon" />
        </div>
      `;
      
      // Toggle watched
      div.querySelector('.eye-icon').addEventListener('click', () => {
        toggleWatched(div);
      });

      listContainer.appendChild(div);
    });

    updateItemCount();
  });
}

// Update subtitle and footer counts
function updateItemCount() {
  const count = document.querySelectorAll('.list-item[data-status="to-watch"]').length;
  subtitle.textContent = `${count} item${count !== 1 ? 's' : ''} to watch`;
  footerCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
}

// Listen for storage changes from content scripts
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updatePopup") {
    render();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.streamstack) {
    render();
  }
});

// Call render on load
render();

// Example toggleWatched function
function toggleWatched(div) {
  const isWatched = div.dataset.status === 'watched';
  div.dataset.status = isWatched ? 'to-watch' : 'watched';
  const eyeIcon = div.querySelector('.eye-icon');
  eyeIcon.src = `icons/eye-${isWatched ? 'open' : 'closed'}.png`;

  // Update storage
  chrome.storage.local.get({ streamstack: [] }, ({ streamstack }) => {
    const title = div.querySelector('.entry-title').textContent;
    streamstack = streamstack.map(item => 
      item.title === title ? { ...item, status: div.dataset.status } : item
    );
    chrome.storage.local.set({ streamstack });
    updateItemCount();
  });
}
