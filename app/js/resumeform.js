/*
 * This module handles events on the resume form page
 */

const fs = require("fs");
const {BrowserWindow} = require("electron").remote;
const {dialog} = require("electron").remote;
var Handlebars = require("handlebars");

const utilities = require("./utils"); //XXX

/*********************/
/*      Private      */
/*********************/
//Get the path to user-data directory
var getUserDataPath = function getUserDataPath() {
    return require("electron").remote.getGlobal("sharedSettingObj").appUserDataPath;
};

/****** Get all elements *******/
//Buttons: back, save, resume
var previousPageButton = document.getElementById("previous-page");
var saveFormButton = document.getElementById("save-form");
var resumeButton = document.getElementById("generate-resume");

//Modal dialog elements: cancel and done buttons; modal
var modal = document.getElementById("save-modal");
var modalInput = document.getElementById("modal-filename-input");
var cancelButton = document.getElementById("modal-cancel-button");
var doneButton = document.getElementById("modal-done-button");

//Employment related elements
var addEmploymentButton = document.querySelector(".add-employment");
var removeEmploymentButton = document.querySelector(".remove-employment");
var employmentInfoFieldset = document.querySelector(".employment-info fieldset");
var employmentTemplate = document.querySelector(".employment-template");

//Education related elements
var addEducationButton = document.querySelector(".add-education");
var removeEducationButton = document.querySelector(".remove-education");
var educationInfoFieldset = document.querySelector(".education-info fieldset");
var educationTemplate = document.querySelector(".education-template");

//Projects related elements
var addProjectButton = document.querySelector(".add-project");
var removeProjectButton = document.querySelector(".remove-project");
var projectFieldset = document.querySelector(".technical-experience-info fieldset");
var projectTemplate = document.querySelector(".project-template");

//Skills related elements
var addSkillButton = document.querySelector(".add-skill");
var removeSkillButton = document.querySelector(".remove-skill");
var skillFieldset = document.querySelector(".languages-technologies-info fieldset");
var skillTemplate = document.querySelector(".skill-template");

//Keep track of all added: employments, educations, projects and skills
var empArr,
    eduArr,
    projArr,
    skillArr,
    idForEmployments,
    idForEducations,
    idForProjects,
    idForSkills;

//Resume form template
var resumeFormTemplate;

//This function initializes the resumeFormTemplate
var initializeResumeTemplate = function initializeResumeTemplate() {
    resumeFormTemplate = JSON.parse(fs.readFileSync(getUserDataPath()+"/resumeFileTemplate.json"));
};

//This function initializes the global variables that track employments, educations, projects and skills
var initializeTrackingVariables = function initializeTrackingVariables() {
    empArr = [];
    eduArr = [];
    projArr = [];
    skillArr = [];
    idForEmployments = 0;
    idForEducations = 0;
    idForProjects = 0;
    idForSkills = 0;
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
    empArr.forEach(function(value, index) {
        var empInfo = document.querySelector(".employment-info #" + value.id);
        var newEmp = {};
        newEmp.title = empInfo.querySelector(".title").value;
        newEmp.companyname = empInfo.querySelector(".company-name").value;
        newEmp.timeperiod = empInfo.querySelector(".time-period").value;
        newEmp.description = empInfo.querySelector("textarea").value.split("\n");
        newEmp.description = newEmp.description.filter(function(item) { return item !== ""; });
        resumeFormTemplate.employment.push(newEmp);
    });
    eduArr.forEach(function(value, index) {
        var eduInfo = document.querySelector(".education-info #" + value.id);
        var newEdu = {};
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
        var projInfo = document.querySelector(".technical-experience-info #" + value.id);
        var newProj = {};
        newProj.projectname = projInfo.querySelector(".project-name").value;
        newProj.timeperiod = projInfo.querySelector(".time-period").value;
        var descp = projInfo.querySelector("textarea").value.split("\n");
        newProj.description = descp[0];
        newProj.technologies = descp[1];
        resumeFormTemplate.technicalExperience.push(newProj);
    });
    skillArr.forEach(function(value, index) {
        var skillInfo = document.querySelector(".languages-technologies-info #" + value.id);
        var skillText = skillInfo.querySelector("textarea").value;
        if(skillText) {
            resumeFormTemplate.skills.push(skillText);
        }
    });
};

//Add employment template
var addEmployment = function addEmployment() {
    addEmploymentButton.addEventListener("click", function() {
        idForEmployments++;
        var clonedEmploymentTemplate = employmentTemplate.cloneNode(true);
        clonedEmploymentTemplate.classList.remove("employment-template");
        clonedEmploymentTemplate.id = "employment-" + idForEmployments;
        var newObj = {};
        newObj.id = "employment-" + idForEmployments;
        newObj.template = clonedEmploymentTemplate;
        empArr.push(newObj);
        employmentInfoFieldset.appendChild(clonedEmploymentTemplate);
    });
};

//Remove employment template
var removeEmployment = function removeEmployment() {
    document.querySelector(".employment-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            var grandParent = event.target.parentElement.parentElement;
            var idOfGrandParent = grandParent.id;
            empArr = empArr.filter(function(item) { return item.id !== idOfGrandParent; });
            employmentInfoFieldset.removeChild(grandParent);
        }
    });
};

//Add education template
var addEducation = function addEducation() {
    addEducationButton.addEventListener("click", function() {
        idForEducations++;
        var clonedEducationTemplate = educationTemplate.cloneNode(true);
        clonedEducationTemplate.classList.remove("education-template");
        clonedEducationTemplate.id = "education-" + idForEducations;
        var newObj = {};
        newObj.id = "education-" + idForEducations;
        newObj.template = clonedEducationTemplate;
        eduArr.push(newObj);
        educationInfoFieldset.appendChild(clonedEducationTemplate);
    });
};

//Remove education template
var removeEducation = function removeEducation() {
    document.querySelector(".education-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            var grandParent = event.target.parentElement.parentElement;
            var idOfGrandParent = grandParent.id;
            eduArr = eduArr.filter(function(item) { return item.id !== idOfGrandParent; });
            educationInfoFieldset.removeChild(grandParent);
        }
    });
};

//Add project template
var addProject = function addProject() {
    addProjectButton.addEventListener("click", function() {
        idForProjects++;
        var clonedProjectTemplate = projectTemplate.cloneNode(true);
        clonedProjectTemplate.classList.remove("project-template");
        clonedProjectTemplate.id = "project-" + idForProjects;
        var newObj = {};
        newObj.id = "project-" + idForProjects;
        newObj.template = clonedProjectTemplate;
        projArr.push(newObj);
        projectFieldset.appendChild(clonedProjectTemplate);
    });
};

//Remove project template
var removeProject = function removeProject() {
    document.querySelector(".technical-experience-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            var grandParent = event.target.parentElement.parentElement;
            var idOfGrandParent = grandParent.id;
            projArr = projArr.filter(function(item) { return item.id !== idOfGrandParent; });
            projectFieldset.removeChild(grandParent);
        }
    });
};

//Add new skill template
var addSkill = function addSkill() {
    addSkillButton.addEventListener("click", function() {
        idForSkills++;
        var clonedSkillTemplate = skillTemplate.cloneNode(true);
        clonedSkillTemplate.classList.remove("skill-template");
        clonedSkillTemplate.id = "skill-" + idForSkills;
        var newObj = {};
        newObj.id = "skill-" + idForSkills;
        newObj.template = clonedSkillTemplate;
        skillArr.push(newObj);
        skillFieldset.appendChild(clonedSkillTemplate);
    });
};

//Remove skill template
var removeSkill = function removeSkill() {
    document.querySelector(".languages-technologies-info").addEventListener("click", function(event) {
        if(event.target && event.target.className.indexOf("remove-") >= 0) {
            var grandParent = event.target.parentElement.parentElement;
            var idOfGrandParent = grandParent.id;
            skillArr = skillArr.filter(function(item) { return item.id !== idOfGrandParent; });
            skillFieldset.removeChild(grandParent);
        }
    });
};

var goBack = function goBack() {
    //Initialize the resume template
    initializeResumeTemplate();

    //Initialize the tracking variables
    initializeTrackingVariables();

    //Empty all the input and textarea fields
    var allUserInputElements = document.querySelectorAll("#resume-form input, #resume-form textarea");
    var numOfInputs = allUserInputElements.length;
    for(var i = 0; i < numOfInputs; i++) {
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
        var allUserInputElements = document.querySelectorAll("#resume-form input, #resume-form textarea");
        var numOfInputs = allUserInputElements.length;
        console.log("numOfInputs: " + numOfInputs);
        for(var i = 0; i < numOfInputs; i++) {
            if(allUserInputElements[i].value !== "") {
                unsavedForm = true;
                break;
            }
        }
        if(unsavedForm) {
            var options = {
                type: "question",
                buttons: [ "Yes", "No" ],
                title: "Confirm unsaved form deletion",
                message: "Are you sure you want to go back and lose your unsaved changes?"
            };
            dialog.showMessageBox(options, function cback(response) {
                if(response === 0) {
                    goBack();
                }
            });
        }
        else {
            goBack();
        }
    });
};

//Ask user for filename when either command-S is pressed or
//  save button is clicked
var showDialogToGetFileName = function showDialogToGetFileName() {
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
};

//Save resume template
var saveResumeTemplate = function saveResumeTemplate() {
    cancelButton.addEventListener("click", function() {
        modalInput.placeholder = "Enter file name ...";
        modalInput.style.border = null;
        modal.style.display = "none";
    });

    doneButton.addEventListener("click", function() {
        console.log("done button was clicked");
        //Get the filename entered
        var filename = modalInput.value;
        console.log("filename: " + filename);

        //Validate that the filename should not be empty
        if(filename === "") {
            modalInput.style.border = "2px solid red";
            modalInput.placeholder = "ERROR: You need to type a file name ...";
            return;
        }

        //Check that the filename is not any of these
        if(filename === "Cookies-journal" ||
           filename === "myresume.html" ||
           filename === "styling.css" ||
           filename === "Cookies" ||
           filename === "Preferences" ||
           filename === "resumeFileTemplate.json" ||
           filename === "tempDoc.html") {
            modalInput.value = "";
            modalInput.style.border = "2px solid red";
            modalInput.placeholder = "ERROR: please type a different name ...";
            return;
        }

        //Save the filled resumeFormTemplate in a file and stor it in user-data directory
        var resumeTemplateFilePath = getUserDataPath() + "/" + filename;
        fillResumeTemplate();
        fs.writeFile(resumeTemplateFilePath, JSON.stringify(resumeFormTemplate, null, ' '), function(err) {
            if(err) {
                return console.error("Error while writing file \"" + resumeTemplateFilePath + "\": " + err);
            }
            modal.style.display = "none";
        });
    });
};

//Generate resume
var generateResume = function generateResume() {
    resumeButton.addEventListener("click", function() {
        //Fill resumeFormTemplate
        fillResumeTemplate();

        //Read in the resume template and fill with data using handlebar (templating engine)
        var source = fs.readFileSync(getUserDataPath()+"/myresume.html").toString();
        var template = Handlebars.compile(source);
        var result = template(resumeFormTemplate);

        //Write the generated html to a temporary file
        fs.writeFileSync(getUserDataPath()+"/tempDoc.html", result);

        //Create a new window in the background; this window is generated to create a pdf document
        let win = new BrowserWindow({
            width: 840,
            height: 600,
            show: false
        });

        //Load the temporary html in this background window
        win.loadURL(url.format({
            pathname: path.join(getUserDataPath(), "tempDoc.html"),
            protocol: "file:",
            slashes: true
        }));

        //Create a pdf file from this html document
        win.webContents.on("did-finish-load", () => {
            //Use default printing options
            win.webContents.printToPDF({pageSize: "A4"}, (error, data) => {
                if(error) {
                    throw error;
                }
                //Ask user for filename and location and save the resume file
                var options = {
                    title: "Save Resume",
                    filters: [
                        {name: "PDFs", extensions: ["pdf"]}
                    ]
                };
                dialog.showSaveDialog(options, function(filename) {
                    if(typeof filename !== "undefined") {
                        fs.writeFile(filename, data, (error) => {
                            if(error) {
                                throw error;
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

    //When back button gets clicked go to startup page
    goToStartupPage();

    //When command-S or save button is clicked, ask user for file name
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
    var dynamicEmps = employmentInfoFieldset.getElementsByTagName("div");
    var dynamicEdus = educationInfoFieldset.getElementsByTagName("div");
    var dynamicProjs = projectFieldset.getElementsByTagName("div");
    var dynamicSkills = skillFieldset.getElementsByTagName("div");
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

//Export the public functions
module.exports = {
    initializeForm,
    setupForm
};
