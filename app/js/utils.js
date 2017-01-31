/*
 * This module provides some utilities
 *  properties/objects and functions
 *
 *  This module also deals with all the
 *  filesystem operations: reading, creating,
 *  deleting files/directories
 */

const fs = require("fs");

//Get the path to userData directory
var getUserDataPath = function getUserDataPath() {
    return require("electron").remote.getGlobal("sharedSettingObj").appUserDataPath;
};

//Drectory to store all the saved resume forms for later use: userData/templates
const templatesDir = "templates";
const templatesDirFullPath = getUserDataPath() + "/" + templatesDir;

//Delete the resume form file from userData/templates directory
var deleteResumeFormFile = function deleteResumeFormFile(filename) {
    fs.unlinkSync(templatesDirFullPath + "/" + filename);
};

//Get the form file data; the form file is in userData/templates
var getFormData = function getFormData(formFile) {
    return JSON.parse(fs.readFileSync(templatesDirFullPath + "/" + formFile));
};

//Compare function for Array.prototype.sort()
function compareFunctionForSort(a, b) {
    return fs.statSync(templatesDirFullPath + "/" + b).mtime.getTime() - fs.statSync(templatesDirFullPath + "/" + a).mtime.getTime();
}

//Export the public functions
module.exports = {
    getUserDataPath,
    templatesDirFullPath,
    compareFunctionForSort,
    deleteResumeFormFile,
    getFormData
};
