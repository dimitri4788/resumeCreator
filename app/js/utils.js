/*
 * This module provides some utilities functions
 */

//This function finds the parent element with a specified sub-class-name
//  i.e. the subClassname is a part of the whole class name string; using regex
//  NOTE: OBSOLETE FOR NOW
var findParentWithClass = function findParentWithClass(elem, subClassname) {
    while(elem.className.indexOf(subClassname) === -1) {
        elem = elem.parentElement;
    }
    return elem;
};

//Custom function to insert the specified node after the reference node
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//Export the public functions
module.exports = {
    insertAfter
};
