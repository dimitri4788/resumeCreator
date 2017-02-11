//Load core modules
const fs = require("fs");
var fsExtra = require("fs.extra");
const path = require("path");
const url = require("url");

//Load Electron related modules
const electron = require("electron");
const app = electron.app;  //Module to control application life
const BrowserWindow = electron.BrowserWindow;  //Module to create native browser window

//Load other necessary modules
const jsonfile = require("jsonfile");

//Load custom modules
var menu = require("./js/menu").menu;

//Initial resume template data
var initialResumeTemplateData = require("../etc/resumeFileTemplate.json");

//Save userData directory path as global so we can access from renderer process
var appUserDataPath = app.getPath("userData");
var resumeFilePath = appUserDataPath + "/resumeFileTemplate.json";
global.sharedSettingObj = { appUserDataPath: appUserDataPath };

//Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
let mainWindow;

function createMainWindow() {
    "use strict";

    //If resumeFileTemplate.json does not exist in the userData directory, create it with initialResumeTemplateData
    fs.exists(resumeFilePath, function(exists) {
        if(!exists) {
            fs.writeFile(resumeFilePath, JSON.stringify(initialResumeTemplateData, null, " "), function(err) {
                if(err) {
                    return console.error("Error while writing file \"" + resumeFilePath + "\": " + err);
                }
            });
        }
    });

    //If myresumeMain.html and styling.css do not exist in the userData directory, copy them there from ../etc directory
    var myresumeMainFileSource = "./etc/myresumeMain.html";
    var myresumeStylingFileSource = "./etc/styling.css";
    var myresumeMainFileDest = appUserDataPath + "/myresumeMain.html";
    var myresumeStylingFileDest = appUserDataPath + "/styling.css";
    fsExtra.copy(myresumeMainFileSource, myresumeMainFileDest , { replace: false }, function(err) {
        if(err) {
            //i.e. file already exists or can't write to specified directory
            return console.error("Error while writing file \"" + myresumeMainFileSource + "\": " + err);
        }
    });
    fsExtra.copy(myresumeStylingFileSource, myresumeStylingFileDest, { replace: false }, function(err) {
        if(err) {
            //i.e. file already exists or can't write to specified directory
            return console.error("Error while writing file \"" + myresumeStylingFileSource + "\": " + err);
        }
    });

    //Create the browser window
    mainWindow = new BrowserWindow({
        width: 840,
        height: 600,
        center: true,
        titleBarStyle: "hidden",
        frame: false,
        resizable: false,
        maximizable: false,
        title: "ResumeCreator",
        backgroundColor: "#292C2F"
    });

    //Load the index.html of the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    //Open the DevTools, NOTE: this is only for development purpose
    //mainWindow.webContents.openDevTools();

    //Emitted when the window is closed
    mainWindow.on("closed", function() {
        //Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element
        mainWindow = null;
    });

    //Create application menu
    menu();
}

//This method is called when Electron has finished initialization and is ready to create browser windows
app.on("ready", createMainWindow);

//Quit when all windows are closed
app.on("window-all-closed", function() {
    "use strict";

    if(process.platform !== "darwin") {
        app.quit();
    }
});

//Activate the window when the user clicks on the application's dock icon
app.on("activate", function() {
    "use strict";

    if(mainWindow === null) {
        createMainWindow();
    }
});
