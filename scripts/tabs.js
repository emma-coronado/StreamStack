const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active styling from all tabs
    tabs.forEach(t => t.classList.remove('tab-active'));
    
    // Add active styling to clicked tab
    tab.classList.add('tab-active');

    const filter = tab.dataset.filter;

    // Query current list items dynamically
    const items = document.querySelectorAll('.list-item');

    items.forEach(item => {
      if (filter === 'all' || item.dataset.status === filter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
