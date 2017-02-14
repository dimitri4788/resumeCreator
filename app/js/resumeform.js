/*
 * This module handles resume form page
 */

const path = require("path");
const url = require("url");

const {BrowserWindow} = require("electron").remote;
const {dialog} = require("electron").remote;
const Handlebars = require("handlebars");

const filesystem = require("./filesystem");
const utils = require("./utils");

//TODO: remove reload code from menu.js
/*********************/
/*      Private      */
/*********************/
/****** Get all elements *******/
//Buttons: back, save, resume
var previousPageButton = document.getElementById("previous-page");
var saveFormButton = document.getElementById("save-form");
var resumeButton = document.getElementById("generate-resume");
var asteriskUnsavedForm = document.getElementById("form-unsaved");

//Save modal dialog elements
var saveModal = document.getElementById("save-modal");
var saveModalInput = document.getElementById("modal-filename-input");
var saveModalCancelButton = document.getElementById("smodal-cancel-button");
var saveModalDoneButton = document.getElementById("smodal-done-button");

//Employment related elements
var addEmploymentButton = document.querySelector(".add-employment");
var removeEmploymentButton = document.querySelector(".remove-employment");
var employmentList = document.querySelector(".employment-list");
var employmentTemplate = document.querySelector(".employment-template");

//Education related elements
var addEducationButton = document.querySelector(".add-education");
var removeEducationButton = document.querySelector(".remove-education");
var educationList = document.querySelector(".education-list");
var educationTemplate = document.querySelector(".education-template");

//Projects related elements
var addProjectButton = document.querySelector(".add-project");
var removeProjectButton = document.querySelector(".remove-project");
var projectList = document.querySelector(".project-list");
var projectTemplate = document.querySelector(".project-template");

//Skills related elements
var addSkillButton = document.querySelector(".add-skill");
var removeSkillButton = document.querySelector(".remove-skill");
var skillList = document.querySelector(".skill-list");
var skillTemplate = document.querySelector(".skill-template");

//Keep track of all added: employments, educations, projects and skills ids
var idForEmployments,
    idForEducations,
    idForProjects,
    idForSkills;

//Resume form template
var resumeFormTemplate;

//This function initializes the global variables that track employments, educations, projects and skills ids
var initializeTrackingVariables = function initializeTrackingVariables() {
    idForEmployments = 0;
    idForEducations = 0;
    idForProjects = 0;
    idForSkills = 0;
};

//This function initializes the resumeFormTemplate
var initializeResumeTemplate = function initializeResumeTemplate() {
    resumeFormTemplate = filesystem.getResumeFormTemplate();
};

//This function fills resumeFormTemplate with the data
//  input'ted by the user in the form
var fillResumeTemplate = function fillResumeTemplate() {
    //Get all the data input'ed by the user and fill resumeFormTemplate
    resumeFormTemplate.personalInfo.name = document.querySelector(".personal-info .fullname").value;
    resumeFormTemplate.personalInfo.address.addressline1 = document.querySelector(".personal-info .street-address").value;
    resumeFormTemplate.personalInfo.address.addressline2 = document.querySelector(".personal-info .apartment-number").value;
    resumeFormTemplate.personalInfo.address.city = document.querySelector(".personal-info .city").value;
    resumeFormTemplate.personalInfo.address.state = document.querySelector(".personal-info .state").value;
    resumeFormTemplate.personalInfo.address.zipcode = document.querySelector(".personal-info .zip-code").value;
    resumeFormTemplate.personalInfo.phone = document.querySelector(".personal-info .phone").value;
    resumeFormTemplate.personalInfo.email = document.querySelector(".personal-info .email").value;
    resumeFormTemplate.websites.github = document.querySelector(".website-urls .github-url").value;
    resumeFormTemplate.websites.linkedin = document.querySelector(".website-urls .linkedin-url").value;
    resumeFormTemplate.websites.twitter = document.querySelector(".website-urls .twitter-url").value;
    resumeFormTemplate.websites.personalWebsite = document.querySelector(".website-urls .personal-url").value;

    //Get dynamically added data
    let empArr = employmentList.querySelectorAll("li");
    let eduArr = educationList.querySelectorAll("li");
    let projArr = projectList.querySelectorAll("li");
    let skillArr = skillList.querySelectorAll("li");

    empArr.forEach(function(value, index) {
        let empInfo = document.querySelector(".employment-info #" + value.id);
        let newEmp = {};
        newEmp.title = empInfo.querySelector(".title").value;
        newEmp.companyname = empInfo.querySelector(".company-name").value;
        newEmp.timeperiod = empInfo.querySelector(".time-period").value;
        newEmp.description = empInfo.querySelector("textarea").value.split("\n");
        newEmp.description = newEmp.description.filter(function(item) { return item !== ""; });
        resumeFormTemplate.employment.push(newEmp);
    });
    eduArr.forEach(function(value, index) {
        let eduInfo = document.querySelector(".education-info #" + value.id);
        let newEdu = {};
        newEdu.city = eduInfo.querySelector(".city").value;
        newEdu.state = eduInfo.querySelector(".state").value;
        newEdu.schoolname = eduInfo.querySelector(".school-name").value;
        newEdu.timeperiod = eduInfo.querySelector(".time-period").value;
        newEdu.degree = eduInfo.querySelector(".degree").value;
        newEdu.fieldofstudy = eduInfo.querySelector(".field-of-study").value;
        newEdu.month = eduInfo.querySelector(".month-of-graduation").value;
        newEdu.year = eduInfo.querySelector(".year-of-graduation").value;
        newEdu.grade = eduInfo.querySelector(".grade").value;
        resumeFormTemplate.education.push(newEdu);
    });
    projArr.forEach(function(value, index) {
        let projInfo = document.querySelector(".technical-experience-info #" + value.id);
        let newProj = {};
        newProj.projectname = projInfo.querySelector(".project-name").value;
        newProj.timeperiod = projInfo.querySelector(".time-period").value;
        let descp = projInfo.querySelector("textarea").value.split("\n");
        newProj.description = descp[0];
        newProj.technologies = descp[1];
        resumeFormTemplate.technicalExperience.push(newProj);
    });
    skillArr.forEach(function(value, index) {
        let skillInfo = document.querySelector(".languages-technologies-info #" + value.id);
        let skillText = skillInfo.querySelector("textarea").value;
        if(skillText) {
            resumeFormTemplate.skills.push(skillText);
        }
    });
};

//Add employment template
var addEmployment = function addEmployment() {
    addEmploymentButton.addEventListener("click", function() {
        asteriskUnsavedForm.style.display = "inline";
        idForEmployments++;
        let clonedEmploymentTemplate = employmentTemplate.cloneNode(true);
        clonedEmploymentTemplate.classList.remove("employment-template");
        clonedEmploymentTemplate.id = "employment-" + idForEmployments;
        employmentList.appendChild(clonedEmploymentTemplate);
    });
};

//Remove employment template
var removeEmployment = function removeEmployment() {
    document.querySelector(".employment-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            asteriskUnsavedForm.style.display = "inline";
            let liToBeRemoved = event.target.closest("li");
            let idOfLiToBeRemoved = liToBeRemoved.id;
            employmentList.removeChild(liToBeRemoved);
        }
    });
};

//Add education template
var addEducation = function addEducation() {
    addEducationButton.addEventListener("click", function() {
        asteriskUnsavedForm.style.display = "inline";
        idForEducations++;
        let clonedEducationTemplate = educationTemplate.cloneNode(true);
        clonedEducationTemplate.classList.remove("education-template");
        clonedEducationTemplate.id = "education-" + idForEducations;
        educationList.appendChild(clonedEducationTemplate);
    });
};

//Remove education template
var removeEducation = function removeEducation() {
    document.querySelector(".education-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            asteriskUnsavedForm.style.display = "inline";
            let liToBeRemoved = event.target.closest("li");
            let idOfLiToBeRemoved = liToBeRemoved.id;
            educationList.removeChild(liToBeRemoved);
        }
    });
};

//Add project template
var addProject = function addProject() {
    addProjectButton.addEventListener("click", function() {
        asteriskUnsavedForm.style.display = "inline";
        idForProjects++;
        let clonedProjectTemplate = projectTemplate.cloneNode(true);
        clonedProjectTemplate.classList.remove("project-template");
        clonedProjectTemplate.id = "project-" + idForProjects;
        projectList.appendChild(clonedProjectTemplate);
    });
};

//Remove project template
var removeProject = function removeProject() {
    document.querySelector(".technical-experience-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            asteriskUnsavedForm.style.display = "inline";
            let liToBeRemoved = event.target.closest("li");
            let idOfLiToBeRemoved = liToBeRemoved.id;
            projectList.removeChild(liToBeRemoved);
        }
    });
};

//Add new skill template
var addSkill = function addSkill() {
    addSkillButton.addEventListener("click", function() {
        asteriskUnsavedForm.style.display = "inline";
        idForSkills++;
        let clonedSkillTemplate = skillTemplate.cloneNode(true);
        clonedSkillTemplate.classList.remove("skill-template");
        clonedSkillTemplate.id = "skill-" + idForSkills;
        skillList.appendChild(clonedSkillTemplate);
    });
};

//Remove skill template
var removeSkill = function removeSkill() {
    document.querySelector(".languages-technologies-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            asteriskUnsavedForm.style.display = "inline";
            let liToBeRemoved = event.target.closest("li");
            let idOfLiToBeRemoved = liToBeRemoved.id;
            skillList.removeChild(liToBeRemoved);
        }
    });
};

//This function moves element up
var moveUp = function moveUp() {
    let selectors = ".employment-info, .education-info, .technical-experience-info, .languages-technologies-info";
    let allSections = document.querySelectorAll(selectors);
    for(let i = 0; i < allSections.length; i++) {
        allSections[i].addEventListener("click", function(event) {
            if(event.target && event.target.className.indexOf("move-up") >= 0) {
                asteriskUnsavedForm.style.display = "inline";
                let closestUL = event.target.closest("ul");
                let movingLI = event.target.closest("li");
                let previousLI = movingLI.previousSibling;
                if(typeof(previousLI) !== "undefined" && previousLI !== null) {
                    closestUL.insertBefore(movingLI, previousLI);
                }
            }
        });
    }
};

//This funtion moves element down
var moveDown = function moveDown() {
    let selectors = ".employment-info, .education-info, .technical-experience-info, .languages-technologies-info";
    let allSections = document.querySelectorAll(selectors);
    for(let i = 0; i < allSections.length; i++) {
        allSections[i].addEventListener("click", function(event) {
            if(event.target && event.target.className.indexOf("move-down") >= 0) {
                asteriskUnsavedForm.style.display = "inline";
                let closestUL = event.target.closest("ul");
                let movingLI = event.target.closest("li");
                let nextLI = movingLI.nextSibling;
                if(typeof(nextLI) !== "undefined" && nextLI !== null) {
                    //Since JavaScript does not have its native insertAfter method, so I wrote my custom
                    utils.insertAfter(movingLI, nextLI);
                }
            }
        });
    }
};

var goBack = function goBack() {
    //Initialize the resume template
    initializeResumeTemplate();

    //Initialize the tracking variables
    initializeTrackingVariables();

    //Empty all the input and textarea fields
    let allUserInputElements = document.querySelectorAll("#resume-form input, #resume-form textarea");
    let numOfInputs = allUserInputElements.length;
    for(let i = 0; i < numOfInputs; i++) {
        allUserInputElements[i].value = "";
    }

    //Go back
    resumeFormPage.classList.remove("appear");
    startupPage.classList.remove("disappear");
};

//Go to startup page when back button is clicked
var goToStartupPage = function goToStartupPage() {
    previousPageButton.addEventListener("click", function() {
        //Show dialog message for confirmation if any of the input fields
        //  are dirty, i.e. there are unsaved changes in the form
        var unsavedForm = false;
        let allUserInputElements = document.querySelectorAll("#resume-form input, #resume-form textarea");
        let numOfInputs = allUserInputElements.length;
        for(let i = 0; i < numOfInputs; i++) {
            if(allUserInputElements[i].value !== "") {
                unsavedForm = true;
                break;
            }
        }
        if(unsavedForm && asteriskUnsavedForm.style.display === "inline") {
            let options = {
                type: "question",
                buttons: [ "Yes", "No" ],
                title: "Confirm unsaved form deletion",
                message: "Are you sure you want to go back and lose your unsaved changes?"
            };
            dialog.showMessageBox(options, function cback(response) {
                if(response === 0) {
                    asteriskUnsavedForm.style.display = "none";
                    goBack();
                }
            });
        }
        else {
            asteriskUnsavedForm.style.display = "none";
            goBack();
        }
    });
};

//Ask user for filename when save button is clicked
var showDialogToGetFileName = function showDialogToGetFileName() {
    saveFormButton.addEventListener("click", function() {
        //Show the saveModal dialog
        saveModal.style.display = "block";

        //Put focus on the input element
        saveModalInput.focus();

        //If user clicks outside of the saveModal, close the modal
        document.addEventListener("click", function(event) {
            if(event.target === saveModal) {
                saveModalInput.placeholder = "Enter file name ...";
                saveModalInput.style.border = null;
                saveModal.style.display = "none";
            }
        });
    });
};

//Save resume template
var saveResumeTemplate = function saveResumeTemplate() {
    saveModalCancelButton.addEventListener("click", function() {
        saveModalInput.placeholder = "Enter file name ...";
        saveModalInput.style.border = null;
        saveModal.style.display = "none";
    });

    saveModalDoneButton.addEventListener("click", function() {
        //Get the filename entered
        var filename = saveModalInput.value;

        //Validate that the filename should not be empty
        if(filename === "") {
            saveModalInput.style.border = "2px solid red";
            saveModalInput.placeholder = "ERROR: You need to type a file name ...";
            return;
        }

        //Check that the filename is not any of these
        if(filename === "Cookies-journal" ||
           filename === "myresume.html" ||
           filename === "myresumeMain.html" ||
           filename === "styling.css" ||
           filename === "Cookies" ||
           filename === "Preferences" ||
           filename === "resumeFileTemplate.json" ||
           filename === "tempDoc.html") {
            saveModalInput.value = "";
            saveModalInput.style.border = "2px solid red";
            saveModalInput.placeholder = "ERROR: please type a different name ...";
            return;
        }

        //Save the filled resumeFormTemplate in a file and store it in userData/templates directory
        filesystem.createTemplateDirectory();
        var resumeTemplateFilePath = filesystem.getTemplateDirFullPath() + "/" + filename;
        fillResumeTemplate();
        filesystem.writeSavedFormFile(resumeTemplateFilePath, resumeFormTemplate);

        //Hide the save modal
        saveModal.style.display = "none";

        //Initialize the resume template
        initializeResumeTemplate();

        //Hide the asteriskUnsavedForm symbol
        asteriskUnsavedForm.style.display = "none";
    });
};

//Generate resume
var generateResume = function generateResume() {
    resumeButton.addEventListener("click", function() {
        //Fill resumeFormTemplate
        fillResumeTemplate();

        //Read in the resume template and fill with data using handlebar (templating engine)
        let source = filesystem.getResumeTemplate();
        let template = Handlebars.compile(source);
        let result = template(resumeFormTemplate);

        //Write the generated html to a temporary file
        filesystem.writeHTMLtoTempFile(result);

        //Create a new window in the background; this window is generated to create a pdf document
        let win = new BrowserWindow({
            width: 840,
            height: 600,
            show: false
        });

        //Load the temporary html in this background window
        win.loadURL(url.format({
            pathname: path.join(filesystem.getUserDataPath(), "tempDoc.html"),
            protocol: "file:",
            slashes: true
        }));

        //Create a pdf file from this html document
        win.webContents.on("did-finish-load", function() {
            //Use default printing options
            win.webContents.printToPDF({pageSize: "A4"}, function(error, data) {
                if(error) {
                    throw error;
                }
                //Ask user for filename and location and save the resume file
                let options = {
                    title: "Save Resume",
                    filters: [
                        {name: "PDFs", extensions: ["pdf"]}
                    ]
                };
                dialog.showSaveDialog(options, function(filename) {
                    if(typeof filename !== "undefined") {
                        filesystem.writeResumeFile(filename, data, function(errMessage) {
                            if(errMessage) {
                                throw errMessage;
                            }
                            console.log("Wrote PDF file successfully.");

                            //Initialize the resume template
                            initializeResumeTemplate();
                        });
                    }
                });
            });
        });
    });
};

/*********************/
/*      Public       */
/*********************/
//This function sets up all the event handlers for the form and
//  it is called only once
var setupForm = function setupForm() {
    //Listen for the change in the value of the input or textarea elements,
    //  if changed, mark the form dirty i.e. unsaved
    document.querySelector("#resume-form").addEventListener("input", function(event) {
        if(event.target && (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")) {
            asteriskUnsavedForm.style.display = "inline";
        }
    });

    //Click events to add templates on the resume page
    addEmployment();
    addEducation();
    addProject();
    addSkill();

    //Click events to remove templates on the resume page
    removeEmployment();
    removeEducation();
    removeProject();
    removeSkill();

    //Move dynamically elements up and down
    moveUp();
    moveDown();

    //When back button gets clicked go to startup page
    goToStartupPage();

    //When save button is clicked, ask user for file name
    showDialogToGetFileName();

    //Register events when cancel or done button is clicked in the modal dialog
    saveResumeTemplate();

    //Generate resume when resume button is clicked
    generateResume();
};

//This functions initializes the form by removing dynamically added fields
//  and initializing resume-form template and tracking variables
var initializeForm = function initializeForm() {
    //Remove all the dynamically added elements
    let dynamicEmps = employmentList.getElementsByTagName("li");
    let dynamicEdus = educationList.getElementsByTagName("li");
    let dynamicProjs = projectList.getElementsByTagName("li");
    let dynamicSkills = skillList.getElementsByTagName("li");
    while(dynamicEmps[0]) {
        dynamicEmps[0].parentNode.removeChild(dynamicEmps[0]);
    }
    while(dynamicEdus[0]) {
        dynamicEdus[0].parentNode.removeChild(dynamicEdus[0]);
    }
    while(dynamicProjs[0]) {
        dynamicProjs[0].parentNode.removeChild(dynamicProjs[0]);
    }
    while(dynamicSkills[0]) {
        dynamicSkills[0].parentNode.removeChild(dynamicSkills[0]);
    }

    //Initialize the resume template
    initializeResumeTemplate();

    //Initialize the tracking variables
    initializeTrackingVariables();
};

//This function takes the form file selected by the user, and upload the data in the file
//  to the resume form page
var uploadFormDataIntoFormPage = function uploadFormDataIntoFormPage(filename) {
    //Pre-fill the filename in the save form dialog
    saveModalInput.value = filename;

    //Get the data from the form file; this is the form saved by the user in the past
    var formData = filesystem.getFormData(filename);

    document.querySelector(".personal-info .fullname").value = formData.personalInfo.name;
    document.querySelector(".personal-info .street-address").value = formData.personalInfo.address.addressline1;
    document.querySelector(".personal-info .apartment-number").value = formData.personalInfo.address.addressline2;
    document.querySelector(".personal-info .city").value = formData.personalInfo.address.city;
    document.querySelector(".personal-info .state").value = formData.personalInfo.address.state;
    document.querySelector(".personal-info .zip-code").value = formData.personalInfo.address.zipcode;
    document.querySelector(".personal-info .phone").value = formData.personalInfo.phone;
    document.querySelector(".personal-info .email").value = formData.personalInfo.email;
    document.querySelector(".website-urls .github-url").value = formData.websites.github;
    document.querySelector(".website-urls .linkedin-url").value = formData.websites.linkedin;
    document.querySelector(".website-urls .twitter-url").value = formData.websites.twitter;
    document.querySelector(".website-urls .personal-url").value = formData.websites.personalWebsite;
    var numOfEmp = formData.employment.length,
        numOfEdu = formData.education.length,
        numOfProj = formData.technicalExperience.length,
        numOfSkill = formData.skills.length,
        i;
    for(i = 1; i <= numOfEmp; i++) {
        addEmploymentButton.click();
        let empInfo = document.querySelector(".employment-info #employment-" + i);
        empInfo.querySelector(".title").value = formData.employment[i-1].title;
        empInfo.querySelector(".company-name").value = formData.employment[i-1].companyname;
        empInfo.querySelector(".time-period").value = formData.employment[i-1].timeperiod;
        let descp = "";
        for(var j = 0; j < formData.employment[i-1].description.length; j++) {
            descp += formData.employment[i-1].description[j] + "\n";
        }
        empInfo.querySelector("textarea").value = descp;
    }
    for(i = 1; i <= numOfEdu; i++) {
        addEducationButton.click();
        let eduInfo = document.querySelector(".education-info #education-" + i);
        eduInfo.querySelector(".city").value = formData.education[i-1].city;
        eduInfo.querySelector(".state").value = formData.education[i-1].state;
        eduInfo.querySelector(".school-name").value = formData.education[i-1].schoolname;
        eduInfo.querySelector(".time-period").value = formData.education[i-1].timeperiod;
        eduInfo.querySelector(".degree").value = formData.education[i-1].degree;
        eduInfo.querySelector(".field-of-study").value = formData.education[i-1].fieldofstudy;
        eduInfo.querySelector(".month-of-graduation").value = formData.education[i-1].month;
        eduInfo.querySelector(".year-of-graduation").value = formData.education[i-1].year;
        eduInfo.querySelector(".grade").value = formData.education[i-1].grade;
    }
    for(i = 1; i <= numOfProj; i++) {
        addProjectButton.click();
        let projInfo = document.querySelector(".technical-experience-info #project-" + i);
        projInfo.querySelector(".project-name").value = formData.technicalExperience[i-1].projectname;
        projInfo.querySelector(".time-period").value = formData.technicalExperience[i-1].timeperiod;
        let descp = "";
        descp += formData.technicalExperience[i-1].description;
        descp += "\n";
        descp += formData.technicalExperience[i-1].technologies;
        projInfo.querySelector("textarea").value = descp;
    }
    for(i = 1; i <= numOfSkill; i++) {
        addSkillButton.click();
        let skillInfo = document.querySelector(".languages-technologies-info #skill-" + i);
        skillInfo.querySelector("textarea").value = formData.skills[i-1];
    }
};

//Export the public functions
module.exports = {
    initializeForm,
    setupForm,
    uploadFormDataIntoFormPage
};
