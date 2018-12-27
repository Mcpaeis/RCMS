$(document).ready(function(){
	//electron specific initialisation

	let remote = require('electron').remote;
	let win = remote.BrowserWindow;

	//let mainApp = remote.require('./mian');

	const url = require("url");
	const path = require("path");

	mSession = remote.session;
	expTD = expiryDate(1);

	var txtLogin = $('.login');
	var txtRegister = $('.register');
	var txtLoginProgress= $('#progress-login');
	var txtLoginError = $('#login-error');
	var txtSuccess = $("#success-msg");
	var closeBtn = $('.close');
	txtRegister.css("display", "none");
	//txtLogin.css("display", "none")
	txtLoginProgress.css("display", "none");
	txtLoginError.css("display", "none");
	txtSuccess.css("display", "none");
	$("#txtStaffLogin").on('click', function(e){
		txtLoginProgress.css("display", "block");
		e.preventDefault();
		var id = $("#txtStaffId").val();
		var password = $("#txtPassword").val();
		if (id=="" || password=="") {
			//alert('All fields are required');
			errorMsg = "All fields are required"
			errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
		}else if(id=="math.admin"){
			//--/there can only be one admin
			//--/should check local storage if there is a mail
			var staffId = "admin";
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/login_admin.php",
					data: "txtStaffId="+staffId+"&txtPassword="+password,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							//localStorage["session"] = value.user_id;
							userId = value.user_id;
							expTD = expiryDate(1);
							setCookie("sessionIdAdmin", userId, expTD, mSession, "http://localhost");
							window.location.replace("admin/index.html");
	    					//check the storage of the cookie
						}else{
							//error messages goes here
							//check the error message to see if an admin already exist? if no, display the regsitration page? else 
							errorMsg = value.error_msg;
							if (errorMsg=="Administrator Not Found!") {
								//display the registration page
								txtLoginProgress.css('display', 'none');
								txtLogin.css('display', 'none');
								txtRegister.css('display', 'block');
							}else{
								//display the normal error message
								errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
							}
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
				        } else {
				            errorMsg = "Address Unreacheable! Check connection and try again!";
				            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			//}
		}else if(id=="math.sec"){
			//check thee server for the secretarys mail
			//check for password and redirect to go site
			//confirm login details
			var staffId = "sec";
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/login_sec.php",
				data: "txtStaffId="+staffId+"&txtPassword="+password,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						//localStorage["session"] = value.user_id;
						userId = value.user_id;
						expTD = expiryDate(1);
						setCookie("sessionIdSec", userId, expTD, mSession, "http://localhost");
    					//alert(getCookie("sessionId"));
    					window.location.replace("go/index.html");
					}else{
						//error messages goes here
						errorMsg = value.error_msg;
						errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        } else {
			            errorMsg = "Address Unreacheable! Check connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
		}else{
			//check for username and password and redirect to lo site
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/login_rec.php",
				data: "txtStaffId="+id+"&txtPassword="+password,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						//localStorage["session"] = value.user_id;
						userId = value.user_id;
    					expTD = expiryDate(1);
						setCookie("sessionIdRec", userId, expTD, mSession, "http://localhost");	
    					window.location.replace("lo/index.html");
					}else{
						//error messages goes here
						errorMsg = value.error_msg;
						errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        } else {
			            errorMsg = "Address Unreacheable! Check connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
		}
		return false;
	});
	$('#txtStaffRegister').on('click', function(e){
		e.preventDefault();
		txtLoginProgress.css("display", "block");
		firstName = $("#txtFirstName").val(); 
		lastName = $("#txtLastName").val(); 
		txtPasswordR = $("#txtPasswordR").val(); 
		txtPasswordRC = $("#txtPasswordRC").val(); 
		txtEmail = $("#txtStaffEmail").val();
		if (firstName=="" || lastName=="" || txtPasswordR=="" || txtPasswordRC=="" || txtEmail=="") {
			//alert('Please all fields are required');
			errorMsg = "All fields are required"
			errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
		}else if(txtPasswordR!=txtPasswordRC){
			//alert('Passwords do not match');
			errorMsg = "Passwords do not match"
			errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
		}else{
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/create_admin.php",
				data: "txtAddEmail="+txtEmail+"&txtAddPassword="+txtPasswordR+"&txtAddFirstName="+firstName + "&txtAddLastName="+lastName,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						successMsg = "Registration successful!";
						successDisplay(txtLoginError, txtLoginProgress, txtSuccess, successMsg, closeBtn)
						txtLogin.css('display', 'block');
						txtRegister.css('display', 'none');
					}else{
						//error messages goes here
						//alert(value.error_msg);
						errorMsg = value.error_msg;
						errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn)
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        } else {
			            errorMsg = "Address Unreacheable! Check connection and try again!";
			            errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
			//localStorage['math.admin'] = txtEmail;
			//console.log('ok');
		}
	});
});
function errorDisplay(txtLoginError, txtLoginProgress, txtSuccess, errorMsg, closeBtn){
	txtLoginProgress.css("display", "none");
	txtSuccess.css("display", "none");
	txtLoginError.find("p").text(errorMsg);
	txtLoginError.fadeIn(1500, function(){	
		txtLoginError.css("display", "block");
	});
	closeBtn.on('click', function(){
		txtLoginError.fadeOut(1000, "linear", function(){
			txtLoginError.css("display", "none");
		});
	});
}
function successDisplay(txtLoginError, txtLoginProgress, txtSuccess, successMsg, closeBtn){
	txtLoginProgress.css("display", "none");
	txtLoginError.css("display", "none");
	txtSuccess.find("p").text(successMsg);
	txtSuccess.fadeIn(1500, function(){	
		txtSuccess.css("display", "block");
	});
	closeBtn.on('click', function(){
		txtSuccess.fadeOut(1000, "linear", function(){
			txtSuccess.css("display", "none");
		});
	});
}
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
} 
//for id manipulation
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
//set cookie
function setCookie(cname, cvalue, exdays, mSession, hostUrl) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    mSession.defaultSession.cookies.set({
		name: cname,
		value: cvalue,
		url: hostUrl,
		expirationDate: exdays
	},
	err => {
			if (err)console.log(err);
		}
	);
}
//get cookie
function getCookie(cname, mSession) {
	
}

function expiryDate(exdays){
	var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = d.toUTCString();
    return d.getTime();
}

function getuserId(mSession){
	 var cookie = getCookie("sessionId", mSession);
   	//alert(cookie);
    if (cookie!=null) {
    	id = cookie.substring(5,6);
    	if (id!="") {
    		return id;
    	}else{
    		return "";
    	}
    }else{
    	return "";
    }
}