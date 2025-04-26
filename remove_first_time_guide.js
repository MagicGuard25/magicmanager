// Script to remove First Time Guide from the application
document.addEventListener('DOMContentLoaded', function() {
  // Function to check if we're on the first load and skip the guide
  function skipFirstTimeGuide() {
    console.log('Removing First Time Guide...');
    
    // Set localStorage values to indicate guide has been completed
    localStorage.setItem('firstGuideCompleted', 'true');
    localStorage.setItem('skipFirstGuide', 'true');
    
    // If the app is trying to redirect to first-guide, redirect back to home
    if (window.location.hash.includes('/first-guide')) {
      console.log('Redirecting from first-guide to home...');
      window.location.hash = '/';
    }
    
    // Remove the first guide menu item from settings
    setTimeout(function() {
      const removeFirstGuideMenuItem = function() {
        // Find all elements that might contain the first guide menu item
        const allCellGroups = document.querySelectorAll('.van-cell-group');
        
        allCellGroups.forEach(group => {
          const cells = group.querySelectorAll('.van-cell');
          
          cells.forEach(cell => {
            // Check if this cell contains a link to first-guide
            const link = cell.getAttribute('to');
            if (link === '/first-guide') {
              console.log('Found First Time Guide menu item, removing...');
              // Remove the entire cell group containing this item
              group.style.display = 'none';
            }
          });
        });
      };
      
      // Run immediately and also set up a mutation observer to catch dynamically added elements
      removeFirstGuideMenuItem();
      
      // Set up observer to watch for DOM changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            removeFirstGuideMenuItem();
          }
        });
      });
      
      // Start observing the document body for DOM changes
      observer.observe(document.body, { childList: true, subtree: true });
    }, 1000);
  }
  
  // Run the function to skip the first time guide
  skipFirstTimeGuide();
});
