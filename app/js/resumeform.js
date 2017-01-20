/*
 * This module handles various events on the resume
 * form page
 */

//Back button
var previousPageButton = document.getElementById("previous-page");

//Employment related elements
var addEmploymentButton = document.querySelector(".add-employment");
var employmentInfoFieldset = document.querySelector(".employment-info fieldset");
var employmentTemplate = document.querySelector(".employment-template");

//Education related elements
var addEducationButton = document.querySelector(".add-education");
var educationInfoFieldset = document.querySelector(".education-info fieldset");
var educationTemplate = document.querySelector(".education-template");

//Projects related elements
var addProjectButton = document.querySelector(".add-project");
var projectFieldset = document.querySelector(".technical-experience-info fieldset");
var projectTemplate = document.querySelector(".project-template");

//Skills related elements
var addSkillButton = document.querySelector(".add-skill");
var skillFieldset = document.querySelector(".languages-technologies-info fieldset");
var skillTemplate = document.querySelector(".skill-template");

//Add employment template
var addEmployment = function addEmployment() {
    addEmploymentButton.addEventListener("click", function() {
        var clonedEmploymentTemplate = employmentTemplate.cloneNode(true);
        employmentInfoFieldset.appendChild(clonedEmploymentTemplate);
    });
};

//Add education template
var addEducation = function addEducation() {
    addEducationButton.addEventListener("click", function() {
        var clonedEducationTemplate = educationTemplate.cloneNode(true);
        educationInfoFieldset.appendChild(clonedEducationTemplate);
    });
};

//Add project template
var addProject = function addProject() {
    addProjectButton.addEventListener("click", function() {
        var clonedProjectTemplate = projectTemplate.cloneNode(true);
        projectFieldset.appendChild(clonedProjectTemplate);
    });
};

//Add new skill template
var addSkill = function addSkill() {
    addSkillButton.addEventListener("click", function() {
        var clonedSkillTemplate = skillTemplate.cloneNode(true);
        skillFieldset.appendChild(clonedSkillTemplate);
    });
};

//Go to startup page when back button is clicked
var goToStartupPage = function goToStartupPage() {
    startupPageClasslist = startupPage.classList;
    resumeFormClasslist = resumeFormPage.classList;

    previousPageButton.addEventListener("click", function() {
        resumeFormClasslist.remove("appear");
        startupPageClasslist.remove("disappear");
    });
}

//Export the public functions
module.exports = {
    addEmployment,
    addEducation,
    addProject,
    addSkill,
    goToStartupPage
}
