// popup.js - Popup control logic for the extension

document.addEventListener('DOMContentLoaded', function() {
    const enableSwitch = document.getElementById('enableSwitch');
    const statusText = document.getElementById('statusText');
    const themeOptions = document.querySelectorAll('.theme-option');
    const refreshBtn = document.getElementById('refreshBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    let currentTheme = 'default';
    let isEnabled = true;
    
    // Load current settings
    function loadSettings() {
        chrome.storage.sync.get(['theme', 'enabled'], (data) => {
            currentTheme = data.theme || 'default';
            isEnabled = data.enabled !== false;
            
            enableSwitch.checked = isEnabled;
            updateStatus();
            highlightActiveTheme();
        });
    }
    
    // Update status text
    function updateStatus() {
        if (isEnabled) {
            statusText.textContent = 'Enabled';
            statusText.classList.remove('disabled');
        } else {
            statusText.textContent = 'Disabled';
            statusText.classList.add('disabled');
        }
    }
    
    // Highlight active theme
    function highlightActiveTheme() {
        themeOptions.forEach(option => {
            if (option.dataset.theme === currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // Toggle enabled state
    enableSwitch.addEventListener('change', function() {
        isEnabled = this.checked;
        updateStatus();
        
        chrome.storage.sync.set({ enabled: isEnabled });
        
        // Notify content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url?.includes('chatgpt.com') || tabs[0]?.url?.includes('chat.openai.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleEnabled',
                    enabled: isEnabled
                }).catch(err => {
                    console.log('Page may need refresh to apply changes');
                });
            }
        });
    });
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            currentTheme = this.dataset.theme;
            highlightActiveTheme();
            
            chrome.storage.sync.set({ theme: currentTheme });
            
            // Notify content script
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.url?.includes('chatgpt.com') || tabs[0]?.url?.includes('chat.openai.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'changeTheme',
                        theme: currentTheme
                    }).catch(err => {
                        console.log('Page may need refresh to apply changes');
                    });
                }
            });
        });
    });
    
    // Refresh page
    refreshBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
            window.close();
        });
    });
    
    // Reset settings
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings?')) {
            chrome.storage.sync.clear(() => {
                currentTheme = 'default';
                isEnabled = true;
                chrome.storage.sync.set({ 
                    theme: 'default',
                    enabled: true
                });
                loadSettings();
                
                // Notify content script
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.url?.includes('chatgpt.com') || tabs[0]?.url?.includes('chat.openai.com')) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'changeTheme',
                            theme: 'default'
                        }).catch(err => {
                            console.log('Page may need refresh');
                        });
                    }
                });
            });
        }
    });
    
    // Check if current page is ChatGPT
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || '';
        if (!currentUrl.includes('chatgpt.com') && !currentUrl.includes('chat.openai.com')) {
            // If not on ChatGPT, show a notice
            const container = document.querySelector('.container');
            const notice = document.createElement('div');
            notice.className = 'notice';
            notice.textContent = 'Please use this extension on a ChatGPT page';
            notice.style.cssText = `
                background: #fef2f2;
                color: #991b1b;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 12px;
                text-align: center;
                font-size: 12px;
            `;
            container.insertBefore(notice, container.firstChild);
        }
    });
    
    // Init
    loadSettings();
});