/// <reference path="XrmPageTemplate.js" />
/// <reference path="sdk.jquery.js" />
function beforeOnLoad(context) {

    try {
        //Set Edit Mobile - Email
        var email = Xrm.Page.ui.controls.get("emailaddress1");
        var phone = Xrm.Page.ui.controls.get("mobilephone");

        if (!CanEditEmailMobilePhone() && Xrm.Page.data.entity.getId() != null) {
            //email.setDisabled(true);
            phone.setDisabled(true);
        } else {
            //email.setDisabled(false);
            phone.setDisabled(false);
        }


    } catch (e) {
        var msg = e.message;
    }
}

function GuidsAreEqual(guid1, guid2) {
    var isEqual = false;
    if (guid1 == null || guid2 == null)
        return false;
    return guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase();
}

function errorHandler(error) {
    alert(error.message);
}
function CanEditEmailMobilePhone() {
    var fcvSystemAdministrator = "C87E32E6-BC69-E211-92D0-AC162D73558B";
    var fcvSupervisor = "47023900-8364-E211-9673-000C299C8D8F";
    var fcvSubupervisor = "F0C0EA08-AA6D-E211-A4B2-000C299C8D8F";
    var currentUserRoles = Xrm.Page.context.getUserRoles();
    var value;
    var parentcustomerid = Xrm.Page.getAttribute("parentcustomerid").getValue();
    if (parentcustomerid != null)
        SDK.JQuery.retrieveRecordSynChronous(parentcustomerid[0].id, 'Account', null, null, function (account) {
            if (account.new_join_loyalty == false) {
                value = true;
                var new_isprimarycontact = "new_isprimarycontact";
                if (Xrm.Page.ui.controls.get(new_isprimarycontact) != null)
                    Xrm.Page.ui.controls.get(new_isprimarycontact).setDisabled(false);
            }
        }, this.errorHandler);
    if (value == true) return true;
    for (var i = 0; i < currentUserRoles.length; i++) {
        var userRole = currentUserRoles[i];
        value = GuidsAreEqual(userRole, fcvSystemAdministrator) ||
                GuidsAreEqual(userRole, fcvSupervisor) ||
                GuidsAreEqual(userRole, fcvSubupervisor);
        if (value) return value;
    }

    return false;
}

function isInt(input) {
    return ((input - 0) == input && input % 1 == 0);
}

function generateDuplicatedContactsForm(contacts, title) {
    var w = 400, h = 150;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var html = "<!DOCTYPE html ><html lang='en-US' ><head><title>" + title + "</title>";
    //html += "<link rel='stylesheet' type='text/css' href='../styles/styles.css' />";
    html += "</head><body>" + title + ": ";
    html += "<table summary='" + title + "'><tbody>";
    var lengh = contacts.length;
    for (var i = 0; i < length; i++) {
        html += "<tr><td><a target='_blank' href='" + SDK.JQuery._getServerUrl() + "/main.aspx?etn=contact&pagetype=entityrecord&id=%7B"
                                        + (contacts[i].ContactId + "").replace("{", "").replace("}", "") + "%7D'" + ">" +
                                        +(i + 1) + "." + (contacts[i].FullName == null ? "Contact" : contacts[i].FullName) +
                "</a></td></tr>";
    }
    html += "</tbody></table></body></html>";
    var myWindow = window.open("", "_blank", "location=no,height=" + h + ",width=" + w + ",top=" + top + ",left=" + left + ",scrollbars=0,resizable=0", false);
    myWindow.document.open();
    myWindow.document.write(html);
    myWindow.focus();
}

function check(context) {
    var formType = Xrm.Page.ui.getFormType();
    if (formType != 1 && formType != 2) return true;
    var phone = Xrm.Page.getAttribute("mobilephone").getValue();
    //var home_phone = Xrm.Page.getAttribute("telephone2").getValue();
    var CMND = Xrm.Page.getAttribute("new_idcard").getValue();
    var email = Xrm.Page.getAttribute("emailaddress1").getValue();
    var fam = Xrm.Page.getAttribute("parentcustomerid").getValue() != null ? Xrm.Page.getAttribute("parentcustomerid").getValue()[0].id : "";
    var bday = Xrm.Page.getAttribute("birthdate").getValue();
    //var duedate = Xrm.Page.getAttribute("new_duedate").getValue();
    var id = Xrm.Page.data.entity.getId();
    if (id == null) {
        id = "";
    }
    var vietnameseCharacters = getVietnamseCharacters();
    var regexPattern = "^[A-Z]|^" + vietnameseCharacters;
    var firstname = Xrm.Page.data.entity.attributes.get("firstname");
    var lastname = Xrm.Page.data.entity.attributes.get("lastname");
    firstname.setValue(FirstCharToUpper(Xrm.Page.getAttribute("firstname").getValue()));
    lastname.setValue(FirstCharToUpper(Xrm.Page.getAttribute("lastname").getValue()));

    //Normal Check
    if (!isNameValid("firstname", regexPattern)) {
        alert("First Name cannot contain special characters!");
        Xrm.Page.ui.controls.get("firstname").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }
	
    if (!isNameValid("lastname", regexPattern)) {
        alert("Last Name cannot contain special characters!");
        Xrm.Page.ui.controls.get("lastname").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }	
	
    if (phone == null || phone.length < 8 || phone.length > 11) {
        alert("Mobile Phone must be 8-11 numeric characters!");
        Xrm.Page.ui.controls.get("mobilephone").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }
	
    if (bday == null) {
        alert("You must input value for Birthday");
        Xrm.Page.ui.controls.get("birthdate").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }

    var age = calculateAge(bday.getDate(), bday.getMonth(), bday.getFullYear());
    if (age < 14) {
        alert("The parent can not less than 14 year-old");
        Xrm.Page.ui.controls.get("birthdate").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }

    if (CMND != null) {
        CMND = CMND.replace(/^\s+|\s+$/g, '');
    }

    if (CMND != null && CMND.length > 0 && !isInt(CMND)) {
        alert("The NationalID is invalid");
        Xrm.Page.ui.controls.get("new_idcard").setFocus(true);
        context.getEventArgs().preventDefault();
        return;
    }

    //var now = new Date();
    //now.setHours(0, 0, 0, 0);
    //if (duedate != null) {
    //    if (duedate < now) {
    //        alert("The pregnancy date can not less than current date");
    //        Xrm.Page.ui.controls.get("new_duedate").setFocus(true);
    //        context.getEventArgs().preventDefault();
    //        return;
    //    }
    //}
    //Database Check
    var dontSave = false;
    //check email
    if (email != null && email != '') {
        var emailFilter = "";
        if (id == "")
            emailFilter = "$filter = EMailAddress1 eq '" + email + "'";
        else
            emailFilter = "$filter = EMailAddress1 eq '" + email + "' and ContactId ne (guid'" + (id + '').replace("{", "").replace("}", "") + "')";
        SDK.JQuery.retrieveMultipleRecordsSynChronous('Contact', emailFilter,
            function (contacts) {
                if (contacts.length > 0) {
                    context.getEventArgs().preventDefault();
                    generateDuplicatedContactsForm(contacts, 'Contacts are duplicated Email');
                    dontSave = true;
                    Xrm.Page.ui.controls.get("emailaddress1").setFocus(true);
                }
            }, this.errorHandler, function () {
            });
    }
    //check phonecall
    if (!dontSave && phone != null && phone != '') {
        var phoneFilter = "";
        if (id == "")
            phoneFilter = "$filter = MobilePhone eq '" + phone + "'";
        else
            phoneFilter = "$filter = MobilePhone eq '" + phone + "' and ContactId ne (guid'" + (id + '').replace("{", "").replace("}", "") + "')";
        SDK.JQuery.retrieveMultipleRecordsSynChronous('Contact', phoneFilter,
            function (contacts) {
                if (contacts.length > 0) {
                    context.getEventArgs().preventDefault();
                    generateDuplicatedContactsForm(contacts, 'Contacts are duplicated MobilePhone');
                    dontSave = true;
                    Xrm.Page.ui.controls.get("mobilephone").setFocus(true);
                }
            }, this.errorHandler, function () { });
    }

    if (!dontSave) {

        var parentcustomerid = Xrm.Page.getAttribute("parentcustomerid").getValue();
        if (parentcustomerid != null) {
            var accountId = parentcustomerid[0].id;
            var filter = "$filter=StateCode/Value eq 0 and ParentCustomerId/Id eq guid'" + accountId + "'";
            filter = filter.replace("{", "").replace("}", "");
            SDK.JQuery.retrieveMultipleRecordsSynChronous('Contact', filter,
				function (contacts) {
				    var formType = Xrm.Page.ui.getFormType();
				    if (contacts.length > formType) {
				        alert("Cannot add more than 2 contacts");
				        dontSave = true;
				    }
				},
				this.errorHandler,
				function () { }
			);
        }
    }
    //var url = "/ajax.aspx?f=check_contact" + "&phone=" + phone + "&email=" + email + "&id=" + id + "&fam=" + fam + "&cache=" + (new Date()).getTime();
    //var urlWithoutQuerystring = "/ajax.aspx";
    //var dontSave = false;

    //$.ajax({
    //    async: false,
    //    url: urlWithoutQuerystring,
    //    data:
    //       {
    //           f: "check_contact",
    //           phone: phone,
    //           email: email,
    //           id: id,
    //           fam: fam,
    //           cache: (new Date()).getTime()
    //       },
    //    contentType: "application/json; charset=utf-8",
    //    dataType: 'json',
    //    type: 'GET',
    //    success: function (data) {
    //        if (data.Status == 'fail') {
    //            dontSave = true;

    //            if (data.ErrorType == "Email") {
    //                alert(data.ErrorMessage);
    //                //Xrm.Page.getAttribute("emailaddress1").setValue('');
    //                Xrm.Page.ui.controls.get("emailaddress1").setFocus(true);
    //            }

    //            if (data.ErrorType == "Phone") {
    //                alert(data.ErrorMessage);
    //                Xrm.Page.ui.controls.get("mobilephone").setFocus(true);
    //            }

    //            if (data.ErrorType == "limitAcct") {
    //                alert(data.ErrorMessage);
    //            }
    //        }
    //    }
    //});
    if (dontSave)
        context.getEventArgs().preventDefault();
}

function calculateAge(birthMonth, birthDay, birthYear) {
    todayDate = new Date();
    todayYear = todayDate.getFullYear();
    todayMonth = todayDate.getMonth();
    todayDay = todayDate.getDate();
    age = todayYear - birthYear;

    if (todayMonth < birthMonth - 1) {
        age--;
    }

    if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
        age--;
    }
    return age;
}


function FirstCharToUpper(str) {
    var pieces = str.split(' ');
    for (var i = 0; i < pieces.length; i++) {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}
function getVietnamseCharacters() {
    var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>" +
				  "<entity name='new_settings'>" +
					"<attribute name='new_settingsid' />" +
					"<attribute name='new_value' />" +
					"<filter type='and'>" +
					  "<condition attribute='new_name' operator='eq' value='VietnameseCharacters' />" +
					"</filter>" +
				  "</entity>" +  
				"</fetch>";
    var value = "";
    var retrieveRecords = XrmServiceToolkit.Soap.Fetch(fetchXml, false);
    if (retrieveRecords != null && retrieveRecords.length > 0) {
        value = retrieveRecords[0].attributes["new_value"].value;
    }
    return value;
}

function isNameValid(attrName, pattern) {
    var i;
    var name = Xrm.Page.getAttribute(attrName).getValue().toUpperCase();
    var len = name.length;
    var re = new RegExp(pattern);
    for (i = 0; i < len; i ++) {
        if (!re.test(name[i])) {
            return false;
        }
    }
    return true;
}