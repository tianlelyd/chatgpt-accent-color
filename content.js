// content.js - Script injected into ChatGPT pages

(function() {
    'use strict';
    
    // Available theme list (removed unsupported red theme)
    const THEMES = {
        'default': { name: 'Default', color: '#808080' },
        'blue': { name: 'Blue', color: '#3b82f6' },
        'green': { name: 'Green', color: '#10b981' },
        'yellow': { name: 'Yellow', color: '#f59e0b' },
        'pink': { name: 'Pink', color: '#ec4899' },
        'orange': { name: 'Orange', color: '#f97316' },
        'black': { name: 'Black', color: '#000000' },
        'purple': { name: 'Purple', color: '#9333ea' }
    };
    
    let currentTheme = 'default';
    let isEnabled = true;
    
    // Load settings from storage
    function loadSettings() {
        chrome.storage.sync.get(['theme', 'enabled'], (data) => {
            currentTheme = data.theme || 'default';
            isEnabled = data.enabled !== false;
            
            if (isEnabled) {
                applyTheme(currentTheme);
            }
        });
    }
    
    // Apply theme by modifying data-chat-theme attribute
    function applyTheme(theme) {
        if (!isEnabled || !THEMES[theme]) return;
        
        // Set the theme attribute
        document.documentElement.setAttribute('data-chat-theme', theme);
        
        console.log(`ChatGPT Theme Controller: applied theme "${theme}"`);
    }
    
    // Monitor and maintain theme changes
    function maintainTheme() {
        // Use MutationObserver to watch for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-chat-theme' &&
                    isEnabled) {
                    
                    const currentValue = document.documentElement.getAttribute('data-chat-theme');
                    if (currentValue !== currentTheme) {
                        console.log(`Theme changed externally: ${currentValue} → ${currentTheme}`);
                        // Reapply our theme
                        document.documentElement.setAttribute('data-chat-theme', currentTheme);
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-chat-theme']
        });
        
        // Also periodically check and reapply theme (backup mechanism)
        setInterval(() => {
            if (isEnabled && document.documentElement.getAttribute('data-chat-theme') !== currentTheme) {
                applyTheme(currentTheme);
            }
        }, 1000);
    }
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'changeTheme') {
            currentTheme = request.theme;
            applyTheme(currentTheme);
            sendResponse({ success: true });
        } else if (request.action === 'toggleEnabled') {
            isEnabled = request.enabled;
            if (isEnabled) {
                applyTheme(currentTheme);
            } else {
                // Let ChatGPT use its default theme
                location.reload();
            }
            sendResponse({ success: true });
        } else if (request.action === 'getStatus') {
            sendResponse({ 
                theme: currentTheme,
                enabled: isEnabled
            });
        }
    });
    
    // Initialize extension
    function init() {
        // Load saved settings
        loadSettings();
        
        // Start maintaining theme
        maintainTheme();
        
        // Apply theme when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (isEnabled) {
                    applyTheme(currentTheme);
                }
            });
        } else {
            if (isEnabled) {
                applyTheme(currentTheme);
            }
        }
        
        // Reapply theme after page fully loads (for dynamic content)
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (isEnabled) {
                    applyTheme(currentTheme);
                }
            }, 500);
        });
    }
    
    // Start the extension
    init();
})();