// Final fix for car UI buttons - fixing duplicate recording indicator issue
window.addEventListener('DOMContentLoaded', function() {
  console.log('Final car UI button fix loaded');
  
  // Wait for Vue to initialize
  setTimeout(function() {
    // Function to directly hook into Vue's event system
    function hookIntoVueEvents() {
      console.log('Attempting to hook into Vue events');
      
      // Find the Recoder Task Status cell
      const cells = document.querySelectorAll('.van-cell');
      let recoderCell = null;
      
      cells.forEach(function(cell) {
        if (cell.textContent.includes('Recoder Task Status') || 
            cell.textContent.includes('当前录制状态') || 
            cell.textContent.includes('录制状态')) {
          recoderCell = cell;
          console.log('Found Recoder Task Status cell');
        }
      });
      
      if (!recoderCell) {
        console.log('Recoder Task Status cell not found, will try again later');
        return;
      }
      
      // Check for duplicate recording indicators and remove them
      const recordingTags = recoderCell.querySelectorAll('.van-tag--success');
      if (recordingTags.length > 1) {
        console.log('Found duplicate recording indicators, removing extras');
        // Keep only the first one
        for (let i = 1; i < recordingTags.length; i++) {
          recordingTags[i].remove();
        }
      }
      
      // Find the stop recording button
      const stopButton = recoderCell.querySelector('button');
      if (!stopButton) {
        console.log('Stop button not found, will try again later');
        return;
      }
      
      console.log('Found button:', stopButton.textContent);
      
      // Create a direct connection to the androidFunction
      if (window.androidFunction) {
        console.log('Found androidFunction, creating direct connection');
        
        // Override the button's click event
        const originalClick = stopButton.onclick;
        stopButton.onclick = null;
        
        // Add our own click handler that calls the native function directly
        stopButton.addEventListener('click', function(e) {
          console.log('Stop button clicked, calling native function directly');
          
          // Prevent the original event from firing
          e.preventDefault();
          e.stopPropagation();
          
          try {
            // Call the native function directly
            if (stopButton.textContent.includes('停止录制')) {
              console.log('Calling stopRecorder()');
              window.androidFunction.stopRecorder();
              
              // Force UI update
              setTimeout(function() {
                try {
                  // Update the UI state
                  let status = window.androidFunction.getAllStatus();
                  console.log('Got status:', status);
                  
                  // Force Vue to update by triggering a window event
                  const updateEvent = new CustomEvent('recorder-status-changed', {
                    detail: { status: status }
                  });
                  window.dispatchEvent(updateEvent);
                  
                  // Check for duplicate recording indicators and remove them
                  const recordingTags = recoderCell.querySelectorAll('.van-tag--success');
                  if (recordingTags.length > 0) {
                    console.log('Removing all recording indicators after stop');
                    recordingTags.forEach(tag => tag.remove());
                  }
                } catch (err) {
                  console.error('Error updating UI:', err);
                }
              }, 500);
            } else if (stopButton.textContent.includes('开始录制')) {
              console.log('Calling startHandRecorder()');
              window.androidFunction.startHandRecorder(1);
              
              // Force UI update
              setTimeout(function() {
                try {
                  // Update the UI state
                  let status = window.androidFunction.getAllStatus();
                  console.log('Got status:', status);
                  
                  // Force Vue to update by triggering a window event
                  const updateEvent = new CustomEvent('recorder-status-changed', {
                    detail: { status: status }
                  });
                  window.dispatchEvent(updateEvent);
                  
                  // Check for duplicate recording indicators and remove them
                  const recordingTags = recoderCell.querySelectorAll('.van-tag--success');
                  if (recordingTags.length > 1) {
                    console.log('Found duplicate recording indicators after start, removing extras');
                    // Keep only the first one
                    for (let i = 1; i < recordingTags.length; i++) {
                      recordingTags[i].remove();
                    }
                  }
                } catch (err) {
                  console.error('Error updating UI:', err);
                }
              }, 500);
            }
          } catch (err) {
            console.error('Error calling native function:', err);
            
            // If direct call fails, try the original click handler
            if (originalClick) {
              console.log('Falling back to original click handler');
              originalClick.call(stopButton, e);
            }
          }
          
          return false;
        }, true);
        
        console.log('Button click handler replaced');
      } else {
        console.log('androidFunction not found, using simulation mode');
        
        // In browser simulation mode, we need to simulate the native functions
        window.androidFunction = {
          stopRecorder: function() {
            console.log('Simulated stopRecorder() called');
            
            // Simulate the UI update
            const checkIcon = recoderCell.querySelector('.van-icon-checked');
            if (checkIcon) {
              checkIcon.className = checkIcon.className.replace('van-icon-checked', 'van-icon-warning');
              checkIcon.style.color = '#ff9800';
            }
            
            // Remove all recording tags
            const recordingTags = recoderCell.querySelectorAll('.van-tag--success');
            recordingTags.forEach(tag => tag.remove());
            
            // Change text back to inactive state
            const label = recoderCell.querySelector('.van-cell__label');
            if (label) {
              label.textContent = 'There is no ongoing recording, click the button to start manual recording.';
            }
            
            // Change button text
            stopButton.textContent = '开始录制';
            
            return true;
          },
          startHandRecorder: function() {
            console.log('Simulated startHandRecorder() called');
            
            // Simulate the UI update
            const warningIcon = recoderCell.querySelector('.van-icon-warning');
            if (warningIcon) {
              warningIcon.className = warningIcon.className.replace('van-icon-warning', 'van-icon-checked');
              warningIcon.style.color = '#1989fa';
            }
            
            // Remove any existing recording tags first
            const existingTags = recoderCell.querySelectorAll('.van-tag--success');
            existingTags.forEach(tag => tag.remove());
            
            // Add a single recording tag
            const cellTitle = recoderCell.querySelector('.van-cell__title');
            if (cellTitle) {
              const recordingTag = document.createElement('span');
              recordingTag.className = 'van-tag van-tag--success';
              recordingTag.textContent = '录制中';
              recordingTag.style.marginRight = '10px';
              cellTitle.appendChild(recordingTag);
            }
            
            // Change text to active state
            const label = recoderCell.querySelector('.van-cell__label');
            if (label) {
              label.textContent = '录制模式：熄火录制，当前片段录制时长:4:43分21秒';
            }
            
            // Change button text
            stopButton.textContent = '停止录制/侦测';
            
            return true;
          },
          getAllStatus: function() {
            return JSON.stringify({
              isRecoding: stopButton.textContent.includes('停止录制'),
              RecordingTag: 'H_',
              RecordingTime: 283
            });
          }
        };
        
        // Override the button's click event in simulation mode
        stopButton.addEventListener('click', function(e) {
          console.log('Button clicked in simulation mode');
          e.stopPropagation();
          
          if (stopButton.textContent.includes('停止录制')) {
            window.androidFunction.stopRecorder();
          } else {
            window.androidFunction.startHandRecorder(1);
          }
          
          return false;
        }, true);
      }
    }
    
    // Try to hook into Vue events immediately
    hookIntoVueEvents();
    
    // Also try again after a delay to ensure Vue has fully rendered
    setTimeout(hookIntoVueEvents, 1000);
    setTimeout(hookIntoVueEvents, 3000);
    
    // Set up a mutation observer to detect when new elements are added
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Try to hook into Vue events again when new elements are added
          setTimeout(hookIntoVueEvents, 100);
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
  }, 500);
});
