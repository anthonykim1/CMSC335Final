/****** JS FUNCTIONS FOR INPUT VALIDATION ON SIGN UP PAGE ******/

function check_pass_confirmation() {
    /* Checks if the password and password confirmation are the same */
    if (document.getElementById("signup-password").value == document.getElementById("signup-confirm-password").value) {
        console.log("passwords the same");
        return true;
    } else {
        return false;
    }

}

function check_ticker_date() {
    if (document.getElementById("dateID").value.length ==0 || document.getElementById("stockID").value.length==0) {
        document.getElementById("invalidDateStock").innerHTML = "Double check ticker and date";
        return false;
    } else {
        return true;
    }
}


function check_signup_fields_non_empty() {
    /* Checks that all the fields of the signup page are completed */
    console.log(document.getElementById("signup-name").value.length);
    if (document.getElementById("signup-name").value.length == 0) {
        return false;
    } else if (document.getElementById("signup-username").value.length == 0) {
        return false;
    } else if (document.getElementById("signup-password").value.length == 0) {
        return false;
    } else if (document.getElementById("signup-confirm-password").value.length == 0) {
        return false;
    }
    return true;
}

function confirm_signup() {
    /* if check_signup_fields_not_empty and check_pass_confirmation are both true, then the form submits, else it will not submit and a warning is generated for the user */
    console.log(check_pass_confirmation());
    if (check_signup_fields_non_empty() == false) {
        document.getElementById("signup-warnings").innerHTML = "PLEASE COMPLETE ALL FIELDS";
        return false;
    }
    if (check_pass_confirmation() == false) {
        document.getElementById("signup-warnings").innerHTML = "PASSWORDS DO NOT MATCH";
        return false;
    }
    console.log("made it here");
    document.getElementById("signup-warnings").innerHTML = "";
    return true;

}

module.exports = {check_ticker_date};