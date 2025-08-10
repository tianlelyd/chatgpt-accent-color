// content.js - Script injected into ChatGPT pages

(function() {
    'use strict';
    
    // Available theme list
    const THEMES = {
        'default': { name: 'Default', color: '#808080' },
        'blue': { name: 'Blue', color: '#3b82f6' },
        'green': { name: 'Green', color: '#10b981' },
        'yellow': { name: 'Yellow', color: '#f59e0b' },
        'pink': { name: 'Pink', color: '#ec4899' },
        'orange': { name: 'Orange', color: '#f97316' },
        'black': { name: 'Black', color: '#000000' },
        'purple': { name: 'Purple', color: '#9333ea' },
        'red': { name: 'Red', color: '#ef4444' }
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
    
    // Apply theme
    function applyTheme(theme) {
        if (!isEnabled) return;
        
        // Force set data attribute
        document.documentElement.dataset.chatTheme = theme;
        
        console.log(`ChatGPT Theme Controller: applied theme "${theme}"`);
    }
    
    // Intercept and override theme changes
    function interceptThemeChanges() {
        // 1) Observe DOM mutations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-chat-theme' &&
                    isEnabled) {
                    
                    const currentValue = document.documentElement.dataset.chatTheme;
                    if (currentValue !== currentTheme) {
                        console.log(`Intercepted theme change: ${currentValue} → ${currentTheme}`);
                        document.documentElement.dataset.chatTheme = currentTheme;
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-chat-theme']
        });
    }
    
    // Inject interceptor into page context
    function injectInterceptor() {
        const script = document.createElement('script');
        script.textContent = `
        (function() {
            // Intercept localStorage operations
            const originalSetItem = Storage.prototype.setItem;
            const originalGetItem = Storage.prototype.getItem;
            
            let customTheme = localStorage.getItem('__custom_theme__') || 'default';
            let isInterceptEnabled = localStorage.getItem('__intercept_enabled__') !== 'false';
            
            Storage.prototype.setItem = function(key, value) {
                if (key === '__custom_theme__') {
                    customTheme = value;
                    return originalSetItem.call(this, key, value);
                }
                if (key === '__intercept_enabled__') {
                    isInterceptEnabled = value !== 'false';
                    return originalSetItem.call(this, key, value);
                }
                
                if (key && key.includes('chatTheme') && isInterceptEnabled) {
                    console.log('Intercept localStorage write: ' + key);
                    return originalSetItem.call(this, key, customTheme);
                }
                return originalSetItem.apply(this, arguments);
            };
            
            Storage.prototype.getItem = function(key) {
                if (key === '__custom_theme__' || key === '__intercept_enabled__') {
                    return originalGetItem.call(this, key);
                }
                
                if (key && key.includes('chatTheme') && isInterceptEnabled) {
                    console.log('Intercept localStorage read: returning ' + customTheme);
                    return customTheme;
                }
                return originalGetItem.apply(this, arguments);
            };
            
            // Intercept fetch requests
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = args[0];
                if (typeof url === 'string' && 
                    url.includes('account_user_setting') && 
                    url.includes('chat_theme') && 
                    isInterceptEnabled) {
                    
                    console.log('Intercept theme API request');
                    return Promise.resolve(new Response(JSON.stringify({ success: true }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
                return originalFetch.apply(this, arguments);
            };
        })();
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'changeTheme') {
            currentTheme = request.theme;
            localStorage.setItem('__custom_theme__', currentTheme);
            applyTheme(currentTheme);
            sendResponse({ success: true });
        } else if (request.action === 'toggleEnabled') {
            isEnabled = request.enabled;
            localStorage.setItem('__intercept_enabled__', isEnabled ? 'true' : 'false');
            if (isEnabled) {
                applyTheme(currentTheme);
            } else {
                // Restore default
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
    
    // Init
    function init() {
        // Inject interceptor
        injectInterceptor();
        
        // Load settings
        loadSettings();
        
        // Setup interceptors
        interceptThemeChanges();
        
        // Sync settings from storage to localStorage
        chrome.storage.sync.get(['theme', 'enabled'], (data) => {
            if (data.theme) {
                localStorage.setItem('__custom_theme__', data.theme);
            }
            if (data.enabled !== undefined) {
                localStorage.setItem('__intercept_enabled__', data.enabled ? 'true' : 'false');
            }
        });
        
        // Apply after DOM ready
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
        
        // Final confirmation after window load
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (isEnabled) {
                    applyTheme(currentTheme);
                }
            }, 500);
        });
    }
    
    // Start
    init();
})();