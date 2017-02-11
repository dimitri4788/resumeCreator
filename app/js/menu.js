var electron= require("electron");
var Menu = electron.Menu;
var shell = electron.shell;

exports.menu = function() {
  var template = [
    {
      label: "ResumeCreator",
      submenu: [
        { label: "About ResumeCreator", role: "about" },
        { type: "separator" },
        { label: "Services", role: "services", submenu: [] },
        { type: "separator" },
        { label: "Hide ResumeCreator", accelerator: "Command+H", role: "hide" },
        { label: "Hide Others", accelerator: "Command+Alt+H", role: "hideothers" },
        { label: "Show All", role: "unhide" },
        { type: "separator" },
        { label: "Quit",
          accelerator: "Command+Q",
          click: function() {
            electron.app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "Paste and match style", accelerator: "Shift+CmdOrCtrl+V", selector: "pasteAndMatchStyle:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" },
      ]
    },
    {
      label: "View",
      submenu: [
        {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, win) {
                if(win) win.reload();
            }
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: function(item, win) {
            if(win) win.toggleDevTools();
          }
        },
      ]
    },
    {
      label: "Window",
      role: "window",
      submenu: [
        { label: "Minimize", accelerator: "CmdOrCtrl+M", role: "minimize" },
        { label: "Close", accelerator: "CmdOrCtrl+W", role: "close" },
      ]
    },
    {
      label: "Help",
      role: "help",
      submenu: [
        {
          label: "View ResumeCreator on GitHub",
          click: function() {
            shell.openExternal("https://github.com/deep4788/resumeCreator");
          }
        },
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
