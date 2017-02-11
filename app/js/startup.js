/*
 * This module is where resume creator starts-up
 */

const filesystem = require("./js/filesystem");
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

//This function hides the open file dialog and re-initialize the dialog elements
var hideOpenModal = function hideOpenModal() {
    openModal.style.display = "none";
    openModalSelect.innerHTML = "";
    openModalMessage.innerHTML = "";
};

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
        //Fill the select element with files userData/templates from as options
        var savedFormsfiles = filesystem.getSavedFormsFiles();
        savedFormsfiles.sort(filesystem.compareFunctionForSort);
        for(var index in savedFormsfiles) {
            var newOption = document.createElement("option");
            newOption.setAttribute("value", savedFormsfiles[index]);
            var newOptionText = document.createTextNode(savedFormsfiles[index]);
            newOption.appendChild(newOptionText);
            openModalSelect.appendChild(newOption);
        }

        //Show the openModal dialog
        openModal.style.display = "block";
    });

    //Open modal dialog cancel button event
    openModalCancelButton.addEventListener("click", hideOpenModal);

    //Open modal dialog delete button event
    openModalDeleteButton.addEventListener("click", function() {
        if(openModalSelect.selectedIndex === -1) {
            openModalMessage.innerHTML = "Select a file from above ...";
            return;
        }

        //Delete the resume form file from the filesystem
        filesystem.deleteSavedFormFile(openModalSelect.options[openModalSelect.selectedIndex].value);

        //Remove the resume form file from the select element options
        openModalSelect.remove(openModalSelect.selectedIndex);
    });

    //Open modal dialog open button event
    openModalOpenButton.addEventListener("click", function() {
        if(openModalSelect.selectedIndex === -1) {
            openModalMessage.innerHTML = "Select a file from above ...";
            return;
        }

        //Get the selected option
        var cacheSelectedFile = openModalSelect.options[openModalSelect.selectedIndex].value;

        //Hide the dialog and re-initialize the select element
        hideOpenModal();

        //Show resume form page
        startupPage.classList.add("disappear");
        resumeFormPage.classList.add("appear");

        //Initialize the resume form
        resumeForm.initializeForm();

        //Upload the resume form file data into the form page so user can continue editing
        resumeForm.uploadFormDataIntoFormPage(cacheSelectedFile);
    });

    //Change event for select element when an option is selected
    openModalSelect.addEventListener("change", function() {
        openModalMessage.innerHTML = "";
    });

    //Setup the resume form
    resumeForm.setupForm();
});
