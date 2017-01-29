/*
 * This module is where resume creator starts-up
 */

const resumeForm = require("./js/resumeform");

/****** Get all elements *******/
//Buttons, startu-page, resume-form-page
var createNewResumeButton = document.getElementById("create-new-resume");
var uploadSavedTemplateButton = document.getElementById("upload-saved-resume");
var startupPage = document.getElementById("startup-page");
var resumeFormPage = document.getElementById("resume-form");

//Open modal dialog elements
var openModal = document.getElementById("open-modal");
var openModalSelect = document.getElementById("select-template-list");
var openModalMessage = document.getElementById("error-message");
var openModalCancelButton = document.getElementById("omodal-cancel-button");
var openModalDeleteButton = document.getElementById("omodal-delete-button");
var openModalOpenButton = document.getElementById("omodal-open-button");

//Magic starts here
document.addEventListener("DOMContentLoaded", function(event) {
    //Click event when create new resume is clicked
    createNewResumeButton.addEventListener("click", function() {
        startupPage.classList.add("disappear");
        resumeFormPage.classList.add("appear");

        //Initialize the resume form
        resumeForm.initializeForm();
    });

    //Click event when upload resume template button is clicked
    uploadSavedTemplateButton.addEventListener("click", function() {
        //Show the saveModal dialog
        openModal.style.display = "block";
    });


    /* XXX
    saveFormButton.addEventListener("click", function() {
        //Show the modal dialog
        modal.style.display = "block";

        //Put focus on the input element
        modalInput.focus();

        //If user clicks outside of the modal, close the modal
        document.addEventListener("click", function(event) {
            if(event.target === modal) {
                modalInput.placeholder = "Enter file name ...";
                modalInput.style.border = null;
                modal.style.display = "none";
            }
        });
    });
    */





    //TODO
    //When user clicks on upload the previosuly saved template button and open a dialog and let the user select a file
    //The file will be the *.json file saved in ~/Library/Application\ Support/ResumeCreator/<filename.json>
    //Also, have three button on that dialog: cancel, open and delete


    //Setup the resume form
    resumeForm.setupForm();
});
