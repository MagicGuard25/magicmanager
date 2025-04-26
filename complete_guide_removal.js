// Complete First Time Guide Removal Script
// This script completely removes the First Time Guide from the application

(function() {
  console.log('Completely removing First Time Guide from application...');
  
  // 1. Set localStorage values to indicate guide has been completed
  localStorage.setItem('firstGuideCompleted', 'true');
  localStorage.setItem('skipFirstGuide', 'true');
  
  // 2. Function to modify Vue router to skip First Time Guide
  function modifyRouter() {
    // Wait for Vue router to be initialized
    const checkRouter = setInterval(() => {
      if (window.router) {
        clearInterval(checkRouter);
        
        // Get the original router
        const originalRouter = window.router;
        
        // Modify the router's beforeEach guard to skip the first-guide route
        originalRouter.beforeEach((to, from, next) => {
          if (to.path === '/first-guide') {
            console.log('Intercepted navigation to first-guide, redirecting to home');
            next('/');
          } else {
            next();
          }
        });
        
        console.log('Router modified to skip First Time Guide');
      }
    }, 100);
  }
  
  // 3. Function to remove First Time Guide menu item
  function removeFirstGuideMenuItem() {
    // Use mutation observer to watch for DOM changes
    const observer = new MutationObserver(function() {
      // Find and remove all references to the First Time Guide in the UI
      
      // Remove menu item in settings
      const menuItems = document.querySelectorAll('.van-cell');
      menuItems.forEach(item => {
        const to = item.getAttribute('to');
        if (to === '/first-guide') {
          // Find the parent cell group and hide it
          let parent = item.parentElement;
          while (parent && !parent.classList.contains('van-cell-group')) {
            parent = parent.parentElement;
          }
          
          if (parent) {
            parent.style.display = 'none';
          } else {
            // If we can't find the parent, just hide the item
            item.style.display = 'none';
          }
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 4. Function to override the First Time Guide component
  function overrideFirstGuideComponent() {
    // Check if Vue is available
    const checkVue = setInterval(() => {
      if (window.Vue) {
        clearInterval(checkVue);
        
        // Try to find the First Time Guide component and override it
        try {
          // This is a more aggressive approach to completely disable the component
          // by overriding the component definition
          const app = document.getElementById('app').__vue_app__;
          if (app && app._context && app._context.components) {
            // Override any component that might be related to the guide
            const componentNames = Object.keys(app._context.components);
            componentNames.forEach(name => {
              if (name.toLowerCase().includes('guide') || name.toLowerCase().includes('first')) {
                const originalComponent = app._context.components[name];
                
                // Replace with empty component
                app._context.components[name] = {
                  render() {
                    return null;
                  }
                };
                
                console.log(`Overrode component: ${name}`);
              }
            });
          }
        } catch (e) {
          console.log('Error overriding components:', e);
        }
      }
    }, 100);
  }
  
  // 5. Function to handle any popups or dialogs related to the guide
  function handleGuidePopups() {
    // Use mutation observer to watch for popups
    const observer = new MutationObserver(function() {
      // Find and close any popups related to the guide
      const popups = document.querySelectorAll('.van-popup');
      popups.forEach(popup => {
        // Check if this popup is related to the guide
        const guideRelated = popup.textContent.includes('首次使用向导') || 
                             popup.textContent.includes('First Time Guide');
        
        if (guideRelated) {
          // Find close button or just hide the popup
          const closeButton = popup.querySelector('.van-popup__close-icon');
          if (closeButton) {
            closeButton.click();
          } else {
            popup.style.display = 'none';
          }
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Execute all functions to completely remove the First Time Guide
  document.addEventListener('DOMContentLoaded', function() {
    modifyRouter();
    removeFirstGuideMenuItem();
    overrideFirstGuideComponent();
    handleGuidePopups();
    
    // Additional check: if we're already on the first-guide page, redirect to home
    if (window.location.hash.includes('/first-guide')) {
      window.location.hash = '/';
    }
    
    console.log('First Time Guide removal complete');
  });
})();
