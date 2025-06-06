const { app, BrowserWindow, Menu, dialog } = require('electron');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');

// Settings path
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// Models
const availableModels = [
    { label: 'Default model', value: 'default' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-o3', value: 'o3' },
    { label: 'GPT-o4-mini', value: 'o4-mini' },
    { label: 'GPT-o4-mini-high', value: 'o4-mini-high' },
    { label: 'GPT-4-5', value: 'gpt-4-5' },
    { label: 'GPT-4-1', value: 'gpt-4-1' },
    { label: 'GPT-4-1-mini', value: 'gpt-4-1-mini' },
];

// Base variables
let mainWindow;
let settings = {
    temporaryChat: false,
    model: 'default',
    readyToShow: true
};

// Load settings
function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath);
            settings = JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading settings:', e);
    }
}

// Save settings
function saveSettings() {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
    }
}

// Models sub menu
function buildModelSubmenu() {
    return availableModels.map((model) => ({
        label: model.label,
        type: 'radio',
        checked: settings.model === model.value,
        click: () => {
            settings.model = model.value;
            saveSettings();
        },
    }));
}

// Create menu
function createMenu() {
    const template = [
        {
            label: 'GPT Features',
            submenu: [
                {
                    label: 'Open temporary chat by default',
                    type: 'checkbox',
                    checked: settings.temporaryChat,
                    click: (menuItem) => {
                        settings.temporaryChat = menuItem.checked;
                        saveSettings();
                    }
                },
                {
                    label: 'Models by default',
                    submenu: buildModelSubmenu()
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Open window maximized on startup',
                    type: 'checkbox',
                    checked: settings.maximizeWindow,
                    click: (menuItem) => {
                        settings.maximizeWindow = menuItem.checked;
                        saveSettings();
                    }
                },
                {
                    label: 'Show when ready (avoids white screen)',
                    type: 'checkbox',
                    checked: settings.readyToShow,
                    click: (menuItem) => {
                        settings.readyToShow = menuItem.checked;
                        saveSettings();
                    }
                },
                {
                    label: 'Reload window',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.close();
                        }
                        createWindow();
                        createMenu();
                    }
                },
            ]
        },
        {
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: 'info',
                    title: '',
                    message: 'ChatGPT Wrapper',
                    detail: [
                        'Version: 1.0.3',
                        'Author: Chillcarne',
                        'GitHub: https://github.com/chillcarne/chatgpt-wrapper'
                    ].join('\n'),
                    buttons: ['Close']
                });
            }
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Create window
function createWindow() {
    const baseUrl = 'https://chat.openai.com';
    const url = new URL(baseUrl);

    // Check if temporary chat is needed
    if (settings.temporaryChat) {
        url.searchParams.set('temporary-chat', 'true');
    }

    // Check default model
    if (settings.model && settings.model !== 'default') {
        url.searchParams.set('model', settings.model);
    }

    // Create main window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: 'ChatGPT',
        icon: path.join(__dirname, 'resources/icon.png'),
        autoHideMenuBar: true,
        show: !settings.readyToShow,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Ready-to-show and maximize
    if (settings.readyToShow) {
        mainWindow.once('ready-to-show', () => {
            if (settings.maximizeWindow) {
                mainWindow.maximize();
            }
            mainWindow.show();
        });
    } else {
        if (settings.maximizeWindow) {
            mainWindow.maximize();
        }
    }


    // Load URL
    mainWindow.loadURL(url.toString());
}

// Init
app.whenReady().then(() => {
    loadSettings();
    createMenu();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
