
function isString(value) {
    return typeof value === 'string';
}

function isBoolean(value) {
    return typeof value === 'boolean';
}

function isEmail(value) {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(value);
}

function isValidDate(dateObject) {
    return !isNaN(dateObject) && dateObject.toString() !== "Invalid Date";
}



function validateExecutiveAccountFields(Firstname, Lastname, Active, Email, Linkedin, Birthday){
    if (! isString(Firstname)) {
        return {errorMessage: "'Firstname' must be a string."};
    }
    if (! isString(Lastname)) {
        return {errorMessage: "'Lastname' must be a string."};
    }
    if (! isBoolean(Active)) {
        return {errorMessage: "'Active' must be a boolean."};
    }
    if (! isEmail(Email)) {
        return {errorMessage: "'Email' must be an email."};
    }
    if (! isString(Linkedin)) {
        return {errorMessage: "'Linkedin' must be a string."};
    }
    if (! isValidDate(Birthday)) {
        return {errorMessage: "'Birthday' must be a valid date."};
    }
    return {}
}


module.exports = {
    isString,
    isBoolean,
    isEmail,
    isValidDate,
    validateExecutiveAccountFields
}