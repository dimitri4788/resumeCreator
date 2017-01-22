/*
 * This module handles events on the resume form page
 */

const {BrowserWindow} = require("electron").remote;
var Handlebars = require("handlebars");

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
        newObj["employment-" + idForEmployments] = clonedEmploymentTemplate;
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
            delete empArr[idOfGrandParent];
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
        newObj["education-" + idForEducations] = clonedEducationTemplate;
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
            delete eduArr[idOfGrandParent];
            educationInfoFieldset.removeChild(grandParent);
        }
    });
};

//Add project template
var addProject = function addProject() {
    addProjectButton.addEventListener("click", function() {
        idForProjects++; //FIXME
        var clonedProjectTemplate = projectTemplate.cloneNode(true);
        clonedProjectTemplate.classList.remove("project-template");
        clonedProjectTemplate.id = "project-" + idForProjects;
        var newObj = {};
        newObj["project-" + idForProjects] = clonedProjectTemplate;
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
            delete projArr[idOfGrandParent];
            projectFieldset.removeChild(grandParent);
        }
    });
};

//Add new skill template
var addSkill = function addSkill() {
    addSkillButton.addEventListener("click", function() {
        idForSkills++; //FIXME
        var clonedSkillTemplate = skillTemplate.cloneNode(true);
        clonedSkillTemplate.classList.remove("skill-template");
        clonedSkillTemplate.id = "skill-" + idForSkills;
        var newObj = {};
        newObj["skill-" + idForSkills] = clonedSkillTemplate;
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
            delete skillArr[idOfGrandParent];
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

        //Get all the data input'ed by the user
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
        //TODO change this for loop to iterating for the empArr and using that to create newEmp object
        for(var nEmp = 1; nEmp <= idForEmployments; nEmp++) { //FIXME
            var empInfo = document.querySelector(".employment-info .employment-" + nEmp);
            //console.log(empInfo.querySelector(".title").value);
            //console.log(empInfo.querySelector(".company-name").value);
            var newEmp = {};
            newEmp.title = empInfo.querySelector(".title").value;
            newEmp.companyname = empInfo.querySelector(".company-name").value;
            newEmp.timeperiod = empInfo.querySelector(".time-period").value;
            newEmp.description = [];
            newEmp.description.push(empInfo.querySelector("textarea").value);
            resumeFormTemplate.employment.push(newEmp);
        }
/*
            <div class="employment-info section">
                <fieldset>
                    <legend class="employment-info-legend">EMPLOYMENT <i class="fa fa-plus-circle add-employment" aria-hidden="true"></i></legend>
                    <div class="employment employment-template">
                        <div class="employment-header">
                            <div class="label">EMPLOYMENT</div>
                            <i class="fa fa-minus-circle remove-employment" aria-hidden="true"></i>
                        </div>
                        <div class="employment-metadata">
                            <input type="text" placeholder="title" name="title" class="title">
                            <input type="text" placeholder="company name" name="company-name" class="company-name">
                            <input type="text" placeholder="time period" name="time-period" class="time-period">
                        </div>
                        <div class="employment-description">
                            <textarea class="employment-desc-text" placeholder="write description in short sentences, one per line ..."></textarea>
                        </div>
                    </div>
                </fieldset>
            </div>
            */
        /*
        {
            "employment": [
                 {
                     "title": "SE",
                     "companyname": "Google",
                     "timeperiod": "March - April",
                     "description": [
                         "I was a busbiy",
                         "I developed this",
                         "I developed that"
                     ]
                 },
                 {
                     "title": "HE",
                     "companyname": "Citrix",
                     "timeperiod": "Dec - May",
                     "description": [
                         "Created hh",
                         "I created this and that"
                     ]
                 }
            ],
            "education": [
                 {
                     "city": "",
                     "schoolname": "",
                     "timeperiod": "",
                     "degree": "",
                     "fieldofstudy": "",
                     "grade": ""
                 },
                 {
                     "city": "",
                     "schoolname": "",
                     "timeperiod": "",
                     "degree": "",
                     "fieldofstudy": "",
                     "grade": ""
                 }
            ],
            "technicalExperience": [
                 {
                     "projectname": "",
                     "timeperiod": "",
                     "description": ""
                 }
            ],
            "skills": [
                "",
                "",
                ""
            ]
        }
        */


        var source = fs.readFileSync(getUserDataPath()+"/myresume.html").toString();
        var template = Handlebars.compile(source);
        //var data = { "myname": "Deep Aggarwal", "hometown": "Champaign" };
        //var data = fs.readFileSync(getUserDataPath()+"/delme.json").toString();
        //var data = require(getUserDataPath()+"/delme.json");

        //console.log("data: " + data.personalInfo.name);
        console.log("resumeFormTemplate 3: " + resumeFormTemplate);
        //data.personalInfo.name = "Zsa Lu";
        //var result = template(data);
        var result = template(resumeFormTemplate);
        //console.log("result: " + result);
        fs.writeFileSync(getUserDataPath()+"/temp2.html", result);

        //TODO add comments everywhere
        let win = new BrowserWindow({width: 840, height: 600, show: false});

        //Load the index.html of the app
        win.loadURL(url.format({
            pathname: path.join(getUserDataPath(), "temp2.html"),
            protocol: "file:",
            slashes: true
        }));

        win.webContents.on("did-finish-load", () => {
            // Use default printing options
            win.webContents.printToPDF({pageSize: "A4"}, (error, data) => {
                if(error) {
                    throw error;
                }
                fs.writeFile("/Users/deep/Desktop/print.pdf", data, (error) => {
                    if(error) {
                        throw error;
                    }
                    console.log("Write PDF successfully.");
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
