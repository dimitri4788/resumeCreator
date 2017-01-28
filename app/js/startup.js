/*
 * This module is where resume creator starts-up
 */

const fs = require("fs");
const path = require("path");
const url = require("url");

const resumeForm = require("./js/resumeform");

//Get the elements
var createNewResumeButton = document.getElementById("create-new-resume");
var startupPage = document.getElementById("startup-page");
var resumeFormPage = document.getElementById("resume-form");

//Magic starts here
function main() {
    $("#create-new-resume").click(function() {
        $("#startup-page").fadeOut("slow", function() {
            $("#resume-form").fadeIn("slow");
        });
    });

    //Modal: make a modal that pops-up if there are unsaved changes in the form
}

document.addEventListener("DOMContentLoaded", function(event) {
    //Click event when create new resume is clicked
    createNewResumeButton.addEventListener("click", function() {
        startupPage.classList.add("disappear");
        resumeFormPage.classList.add("appear");

        //Initialize the resume form
        resumeForm.initializeForm();
    });

    //TODO
    //When user clicks on upload the previosuly saved template button and open a dialog and let the user select a file
    //The file will be the *.json file saved in ~/Library/Application\ Support/ResumeCreator/<filename.json>
    //Also, provide cross next to the file so user can delete the file if they want, so that past templates can be deleted
    //or have three button on that dialog: cancel, open and delete

    //Setup the resume form
    resumeForm.setupForm();
});
