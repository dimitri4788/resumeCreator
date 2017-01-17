const fs = require("fs");
const path = require("path");
const url = require("url");

const {BrowserWindow} = require("electron").remote;
var Handlebars = require("handlebars");

function getBuiltPath() {
    "use strict";

    var appUserDataPath = require("electron").remote.getGlobal("sharedSettingObj").appUserDataPath;
    console.log("appUserDataPath: " +  appUserDataPath);
    return appUserDataPath;
}


//Magic starts here
function main() {
    "use strict";

    $(".create-new-resume").click(function() {
        $(".startup-page").fadeOut("slow", function() {
            $(".resume-form").fadeIn("slow");
        });
    });

    //Add new employment template when user click on plus
    $(".add-employment").click(function() {
        //Get the required elements and append child template
        var $employmentFieldset = $(".employment-info fieldset");
        var $employmentTemplate = $(".employment-template").html();
        $employmentFieldset.append($employmentTemplate);
    });

    //Add new education template when user click on plus
    $(".add-education").click(function() {
        //Get the required elements and append child template
        var $educationFieldset = $(".education-info fieldset");
        var $educationTemplate = $(".education-template").html();
        $educationFieldset.append($educationTemplate);
    });

    //Add new project template when user click on plus
    $(".add-project").click(function() {
        //Get the required elements and append child template
        var $projectFieldset = $(".technical-experience-info fieldset");
        var $projectTemplate = $(".project-template").html();
        $projectFieldset.append($projectTemplate);
    });

    //Add new skill template when user click on plus
    $(".add-skill").click(function() {
        //Get the required elements and append child template
        var $skillFieldset = $(".languages-technologies-info fieldset");
        var $skillTemplate = $(".skill-template").html();
        $skillFieldset.append($skillTemplate);
    });


    //var source = fs.readFileSync(getBuiltPath()+"/temp.html").toString();
    //var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " + "{{kids.length}} kids:</p>" + "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
    //var template = Handlebars.compile(source);
    //var data = { "myname": "xxxDEEPaggarwal", "hometown": "Somewhere, TX", "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
    //var result = template(data);
    //console.log(result);
    //fs.writeFileSync(getBuiltPath()+"/temp2.html", result);

    //TODO add comments everywhere
    //let win = new BrowserWindow({width: 840, height: 600});
    //let win = new BrowserWindow({width: 800, height: 600, show: false});

    // Or load a local HTML file
    //win.loadURL(`file://${__dirname}/index.html`)
    //Load the index.html of the app
    //win.loadURL(url.format({
    //    pathname: path.join(getBuiltPath(), "temp2.html"),
    //    protocol: "file:",
    //    slashes: true
    //}));

    //win.webContents.on("did-finish-load", () => {
    //    // Use default printing options
    //    win.webContents.printToPDF({pageSize: "A4"}, (error, data) => {
    //        if (error) {
    //            throw error;
    //        }
    //        fs.writeFile("/Users/deep/Desktop/print.pdf", data, (error) => {
    //            if (error) {
    //                throw error;
    //            }
    //            console.log("Write PDF successfully.");
    //        });
    //    });
    //});

    /*
    $(".create-new-resume").click(function(event) {
        event.preventDefault();
        $(".startup-page").fadeOut("slow", function() {
            $(".resume-form").fadeIn("slow");
        });
    });

    $(".resume-form .previous-page").click(function(event) {
        event.preventDefault();
        $(".resume-form").fadeOut("slow", function() {
            $(".startup-page").fadeIn("slow");
        });
    });

    $(".resume-form .generate-resume").click(function(event) {
        event.preventDefault();
        var fullname = $(".resume-form .name #fullname").val();
        var email = $(".resume-form .email #email").val();
        var phonenumber = $(".resume-form .phone-number #phone-number").val();
        var addressline1 = $(".resume-form .home-address #address-line-1").val();
        var addressline2 = $(".resume-form .home-address #address-line-2").val();
        var city = $(".resume-form .home-address #city").val();
        var state = $(".resume-form .home-address #state").val();
        var zipCode = $(".resume-form .home-address #zip-code").val();
        var githubUrl = $(".resume-form .websites #github-url").val();
        var linkedinUrl = $(".resume-form .websites #linkedin-url").val();
        var twitterUrl = $(".resume-form .websites #twitter-url").val();
        var portfolioUrl = $(".resume-form .websites #portfolio-url").val();

        fullname = "deep Aggarwal";
        email = "deep.uiuc@gmail.com";
        console.log(fullname);
        console.log(email);
        console.log(phonenumber);
        console.log(addressline1);
        console.log(addressline2);
        console.log(city);
        console.log(state);
        console.log(zipCode);
        console.log(githubUrl);
        console.log(linkedinUrl);
        console.log(twitterUrl);
        console.log(portfolioUrl);

    $(".resume-form .document .name #fullname").focusout(function() {
        var vvv = $(".resume-form .document .name #fullname").val();
        //var vvv = $(this).val();
        $(this).replaceWith("<span>"+vvv+"</span>");
    });
        // Default export is a4 paper, portrait, using milimeters for units
         //doc.text("Hello world!", 10, 10);
         //doc.save("a4.pdf");
         //*/
}

$(document).ready(main());
