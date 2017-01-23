/*
 * This module handles events on the resume form page
 */

const {BrowserWindow} = require("electron").remote;
var Handlebars = require("handlebars");

const utilities = require("./utils");

/*********************/
/*      Private      */
/*********************/
//Get the path to user-data directory
var getUserDataPath = function getUserDataPath() {
    return require("electron").remote.getGlobal("sharedSettingObj").appUserDataPath;
};

//Keep track of all added: employments, educations, projects and skills
var empArr = [];
var eduArr = [];
var projArr = [];
var skillArr = [];
var idForEmployments = 0;
var idForEducations = 0;
var idForProjects = 0;
var idForSkills = 0;

//Resume form template
var resumeFormTemplate;

//This function initializes the resumeFormTemplate
var initializeResumeTemplate = function resetState() {
    resumeFormTemplate = require(getUserDataPath()+"/resumeFileTemplate.json");
};

/*********************/
/*      Public       */
/*********************/
//Back button element
var previousPageButton = document.getElementById("previous-page");

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

//Resume generate button
var resumeButton = document.getElementById("generate-resume");

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

//Go to startup page when back button is clicked
var goToStartupPage = function goToStartupPage() {
    previousPageButton.addEventListener("click", function() {
        //Initialize the resume template
        initializeResumeTemplate();
        resumeFormPage.classList.remove("appear");
        startupPage.classList.remove("disappear");
    });
};

//Save form: command-S or click on save button
var saveForm = function saveForm() {
    //TODO to be done later
    //Ask for file name
};

//Generate resume
var generateResume = function generateResume() {
    resumeButton.addEventListener("click", function() {
        //Initialize the resume template
        initializeResumeTemplate();

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
            console.log(resumeFormTemplate);
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
            console.log(resumeFormTemplate);
        });
        skillArr.forEach(function(value, index) {
            var skillInfo = document.querySelector(".languages-technologies-info #" + value.id);
            resumeFormTemplate.skills.push(skillInfo.querySelector("textarea").value);
            console.log(resumeFormTemplate);
        });

        //Read in the resume template and fill with data using handlebar (templating engine)
        console.log("resumeFormTemplate: " + resumeFormTemplate);
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
                //TODO: ask user the file name and location to save the resume file to
                fs.writeFile("/Users/deep/Desktop/print.pdf", data, (error) => {
                    if(error) {
                        throw error;
                    }
                    console.log("Wrote PDF file successfully.");
                });
            });
        });
    });
};

//Export the public functions
module.exports = {
    addEmployment,
    addEducation,
    addProject,
    addSkill,
    removeEmployment,
    removeEducation,
    removeProject,
    removeSkill,
    goToStartupPage,
    saveForm,
    generateResume
};
