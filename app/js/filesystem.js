/*
 * This module handles filesystem access
 *
 *  Deals with all the filesystem
 *  operations: reading, creating,
 *  deleting files/directories
 */

const fs = require("fs");

//Get the path to userData directory
var getUserDataPath = function getUserDataPath() {
    return require("electron").remote.getGlobal("sharedSettingObj").appUserDataPath;
};

//Directory to store all the saved resume forms for later use: userData/templates
const templatesDir = "templates";
const templatesDirFullPath = getUserDataPath() + "/" + templatesDir;

//This function returns the full path to the templates directory
var getTemplateDirFullPath = function getTemplateDirFullPath() {
    return templatesDirFullPath;
};

//Delete the resume form file from userData/templates directory
var deleteSavedFormFile = function deleteSavedFormFile(filename) {
    fs.unlinkSync(getTemplateDirFullPath() + "/" + filename);
};

//This function returns all the saved-form files
var getSavedFormsFiles = function getSavedFormsFiles() {
    return fs.readdirSync(getTemplateDirFullPath());
};

//Get the form file data; the form file is in userData/templates
var getFormData = function getFormData(formFile) {
    return JSON.parse(fs.readFileSync(getTemplateDirFullPath() + "/" + formFile));
};

//This function initializes the resumeFormTemplate
var getResumeFormTemplate = function getResumeFormTemplate() {
    return JSON.parse(fs.readFileSync(getUserDataPath() + "/resumeFileTemplate.json"));
};

//Compare function for Array.prototype.sort(); compare by latest file timestamp to oldest
function compareFunctionForSort(a, b) {
    return fs.statSync(getTemplateDirFullPath() + "/" + b).mtime.getTime() - fs.statSync(getTemplateDirFullPath() + "/" + a).mtime.getTime();
}

//This function creates a "templates" directory in userData
var createTemplateDirectory = function createTemplateDirectory() {
    if(!fs.existsSync(getTemplateDirFullPath())) {
        fs.mkdirSync(getTemplateDirFullPath());
    }
};

//This function writes the form file to the "templates" directory in userData
var writeSavedFormFile = function(resumeTemplateFilePath, resumeFormTemplate) {
    fs.writeFileSync(resumeTemplateFilePath, JSON.stringify(resumeFormTemplate, null, " "));
};

//This function returns the resume template that gets filled with the templating engine (handlebar)
var getResumeTemplate = function getResumeTemplate() {
    return fs.readFileSync(getUserDataPath() + "/myresume.html").toString();
};

//This function writes the html to a temporary file
var writeHTMLtoTempFile = function writeHTMLtoTempFile(res) {
    fs.writeFileSync(getUserDataPath() + "/tempDoc.html", res);
};

//This function writes the final resume file
var writeResumeFile = function writeResumeFile(filename, data, callback) {
    fs.writeFile(filename, data, function(error) {
        if(error) {
            callback(error);
        }
        callback(undefined);
    });
};

//Export the public functions
module.exports = {
    compareFunctionForSort,
    createTemplateDirectory,
    deleteSavedFormFile,
    getFormData,
    getResumeFormTemplate,
    getResumeTemplate,
    getSavedFormsFiles,
    getTemplateDirFullPath,
    getUserDataPath,
    writeHTMLtoTempFile,
    writeResumeFile,
    writeSavedFormFile
};
