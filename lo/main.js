$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});
jQuery('document').ready(function(){
	//electron specific initialisation

	let remote = require('electron').remote;
	let win = remote.BrowserWindow;

	//let mainApp = remote.require('./mian');

	const url = require("url");
	const path = require("path");

	mSession = remote.session;

	mSession.defaultSession.cookies.get({name:'sessionIdRec'}, (err, cookies) => {
		 localStorage["recId"] = cookies[0].value;
	});

	$(".fab").on('click', function(){
		window.location.replace("index.html");
	});

	//construct category options
	var authorisationReference = localStorage["recId"];
	constructCategoryOptions();
	constructAuthorize(authorisationReference);
	constructUpdateDetails();
	constructForSigning(authorisationReference);
	constructSigned(authorisationReference);

	if (authorisationReference!=="") {
		//alert(adminId);
		$.ajax({
			type: "POST",
			url: "https://mathknust.000webhostapp.com/public/php/get_first_name.php",
			data: "txtId="+authorisationReference+"&txtTable="+"recommenders",
			success: function(html){
				value = JSON.parse(html);
				if (value.error==true) {
					name = value.fname;
					indexName = name.substring(0,1);
					//document.getElementById("image").innerHTML=indexName;
					///window.location.replace("index.html");
				}else{
					//error messages goes here
					alert(value.error_msg);
				}
			},
			beforeSend: function(){
				//error messages
			}
		});
	}else{
		
	}
	//main tabs
	var authorizeRequest = $(".authorize-request");
	var signRecommendation = $(".sign-off");
	var viewSignedRecommendation = $(".signed-recommendations");
	var manageAuthorized = $(".manage-authorized-request");
	
	//tab views
	var formControls = $('.form-controls');
	var formControlsSignOff = $('.form-controls-sign-off');
	var formControlsSigned = $('.form-controls-signed');
	var formControlsManage = $('.form-controls-manage');
	var manageView = $('.manage-view');
	var manageDefault = $('.manage-default');
	
	//hide the other components
	formControls.css('display', 'none');
	formControlsSignOff.css('display', 'none');
	formControlsManage.css('display', 'none');
	manageView.css('display', 'none');

	$(".cancel").on('click', function(e){
		e.preventDefault();
		window.location.replace("index.html");
	});
	
	//hide the other views
	//call the tab listener function
	viewSignedRecommendation.on('click', function(){
		if(formControlsSigned.css("display")=="none"){
			formControlsSigned.css("display", "block");
			//hide the other views
			formControls.css("display", "none");
			formControlsSignOff.css("display", "none");
			formControlsManage.css("display", "none");
		}
	});
	authorizeRequest.on('click', function(){
		if(formControls.css("display")=="none"){
			formControls.css("display", "block");
			formControlsSignOff.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");
		}
	});
	manageAuthorized.on('click', function(){
		var txtClass = $(".form-controls-managerec-msg");
		var form = $(".manage-view");
		if(formControlsManage.css("display")=="none"){
			formControlsManage.css("display", "block");
			//hide the other views
			formControlsSignOff.css("display", "none");
			formControlsSigned.css("display", "none");
			formControls.css("display", "none");
			//placed here because of the multiple class access
			cl = manageDefault.find('.manageAuthorisation');
			length = cl.length;
			//console.log(length);
			for (var i = 0; i < length; i++) {
				cl[i].onchange=function(){
					val = $(this).val();
					classId = $(this).find('option:selected').attr('class');
					sessionStorage.setItem("autId", classId);
					//session storage does not offer you the ability to get the value immediately, local storage does
					localStorage["autId"] = classId;
					//console.log(sessionStorage["flatId"]);
					if (val=="Update Authorization") {
						manageView.css('display', 'block');
						manageDefault.css('display', 'none');
					}else if(val=="Withdraw Authorization"){
						var option = confirm("This action is irreversible!");
						if(option){
							//delete the entry from the system
							$.ajax({
								type: "POST",
								url: "https://mathknust.000webhostapp.com/public/php/delete_recommendation.php",
								data: "idToDelete="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										msg = "Authorisation Withdrawn!";
										status = "positive";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/lo/index.html");
									}else{
										//error messages goes here
										msg = value.error_msg;
										status = "negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								beforeSend: function(){
									//error messages
								}
							});
							//alert('Authorization Revoked');
						}else{
							//stay back there...
						}
					}
				};
			};

		}
	});
	signRecommendation.on('click', function(){
		var txtClass = $(".form-controls-sign-msg");
		var form = $(".form-controls-sign-off");
		if(formControlsSignOff.css("display")=="none"){
			formControlsSignOff.css("display", "block");
			//hide the other views
			formControls.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");

			cl = formControlsSignOff.find('.btnSignOff');
			length = cl.length;
			//console.log(length);
			for (var i = 0; i < length; i++) {
				cl[i].onclick=function(){
					val = $(this).val();
					classId = $(this).attr('id');
					//console.log(classId);
					sessionStorage.setItem("loSigned", classId);
					$.ajax({
						type: "POST",
						url: "https://mathknust.000webhostapp.com/public/php/lo_signed.php",
						data: "idToSign="+classId,
						success: function(html){
							value = JSON.parse(html);
							if (value.error==true) {
								msg = "Recommendation signed!";
								status = "positive";
								errorDisplay(txtClass, msg, status);
								$(form).fadeOut(2000, function(){
									form.fadeIn().delay(2000);
									window.location.replace("index.html");
								});
		    					//window.location.replace("http://192.168.43.13/Mcpaeis/lo/index.html");
							}else{
								//error messages goes here
								msg = value.error_msg;
								status = "negative";
								errorDisplay(txtClass, msg, status);
							}
						},
						beforeSend: function(){
							//error messages
						}
					});
					//alert('Category deleted!');
				}
			};
		}
	});
	
	//authorize request form controls
	$("#txtAuthorizeRequest").on('click', function(e){
		e.preventDefault();
		var txtReference = $("#txtRequesterReference").val();
		var txtCategory = $("#txtCategory").val();
		var txtCopies = $("#txtNumberOfCopies").val();
		var txtClass = $(".form-controls-msg");
		var form = $(".authorizeForm");
		if(txtReference==""){
			msg = 'Please Input a valid reference';
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(txtCopies=="Copies"){
			msg = "Please select valid number of copies";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(txtCategory=="Category"){
			msg = "Please select category";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else{
			//everything is good---an ajax function to send the request to go
			categoryId = $("#txtCategory").find('option:selected').attr('class');
			$.ajax({
				type: "POST",
				url: "https://mathknust.000webhostapp.com/public/php/authorize_request.php",
				data: "txtAuthorisationId="+authorisationReference+"&txtRequesterReference="+txtReference+"&txtCategory="+categoryId+"&txtNumberOfCopies="+txtCopies,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						msg = "Authorization issued!";
						status = "positive";
						errorDisplay(txtClass, msg, status);
						$(form).fadeOut(2000, function(){
							form.fadeIn().delay(2000);
							window.location.replace("index.html");
						});
    					//window.location.replace("http://192.168.43.13/Mcpaeis/lo/index.html");
					}else{
						//error messages goes here
						msg = value.error_msg;
						status = "negative";
						errorDisplay(txtClass, msg, status);
					}
				},
				beforeSend: function(){
					//error messages
				}
			});
			$(this).closest('form').find("input[type=text], input[type=password], textarea").val("");
			$(this).closest('form').find("select").val($(".select option:first").val());
		}
	});
	
	//sign recommendation control
	$(".btnSignOff").on('click', function(){
		//some function to do something---ajax request
		alert('Recommendation signed');
	});
	
	//signed recommendation actions
	$('#revokeSignature').change(function(){
		val = $(this).val();
		if (val=="Revoke Signature") {
			var option = confirm("This action is irreversible!");
			if(option){
				//delete the entry from the system
				alert('Signature Revoked');
			}else{
				//stay back there...
			}
		}
	});
	
	//authorization actions
	// $(".manageAuthorisation").change(function(){
	// 	//display the update view and hide the main
	// 	val = $(this).val();
	// 	if (val=="Update Authorization") {
	// 		manageView.css('display', 'block');
	// 		manageDefault.css('display', 'none');
	// 	}else if(val=="Withdraw Authorization"){
	// 		var option = confirm("This action is irreversible!");
	// 		if(option){
	// 			//delete the entry from the system
	// 			alert('Authorization Revoked');
	// 		}else{
	// 			//stay back there...
	// 		}
	// 	}
	// });
	//have to reconstruct this way because of the more than one class access

	$("#txtAuthorizeRequestUpdate").on('click', function(e){
		e.preventDefault();
		var txtReference = $("#txtRequesterReferenceUpdate").val();
		var txtCopies = $("#txtNumberOfCopiesUpdate").val();
		var txtCategory = $("#txtCategoryUpdate").find('option:selected').attr('class');
		var txtClass = $(".form-controls-managerec-msg");
		var form = $(".manage-view");
		if(txtReference==""){
			msg = "Please type a valid reference";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(txtCopies==""){
			msg = "Please input a valid number of copies";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(txtCategory=="Category"){	
			msg = "Please select a valid category";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else{
			//everything is good---an ajax function to send the request to go
			//display the default
			txtId =  localStorage["autId"];//sessionStorage.getItem("autId");
			$.ajax({
				type: "POST",
				url: "https://mathknust.000webhostapp.com/public/php/update_recommendation.php",
				data: "txtCategory="+txtCategory+"&txtId="+txtId+"&txtCopies="+txtCopies+"&txtReference="+txtReference,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						msg = "Recommendation updated";
						status = "positive";
						errorDisplay(txtClass, msg, status);
						$(form).fadeOut(2000, function(){
							form.fadeIn().delay(2000);
							window.location.replace("index.html");
						});
						//window.location.replace("http://192.168.43.13/Mcpaeis/lo/index.html");
						//console.log(value.error_msg);
					}else{
						//error messages goes here
						msg = value.error_msg;
						status = "negative";
						errorDisplay(txtClass, msg, status);
						//alert(msg);
						//$(".flatDetails").append('<span>'+msg+'</span>');
					}
				},
				beforeSend: function(){
					//error messages
				}
			});
		}
	});
	//controls---logout
	$("#controls-logout").on('click', function(){
		var option = confirm("Are you sure you want to logout?");
		if(option){
			window.location.replace("../index.html");
		}else{
			//stay back there...
		}
	});
});

//get cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getuserId(name){
	 var cookie = getCookie(name);
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

function constructCategoryOptions(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"loAll",
		success: function(html){
			value = JSON.parse(html);
			if (value.error==true) {
				length = value.cat.length;
				if (length==0) {
					//nothing has been added yet do not append anything
					//msg = value.error_msg;
					//$(".flatDetails").append('<span>'+msg+'</span>');
				}else{
					for (var i = 0; i < length; i++) {
						$(".txtCategory").append('<option class='+value.cat[i].c_id+'>'+value.cat[i].c_name+'</option>');
					}

				}
				///window.location.replace("index.html");
			}else{
				//error messages goes here
				msg = value.error_msg;
				//$(".flatDetails").append('<span>'+msg+'</span>');
			}
		},
		beforeSend: function(){
			//error messages
		}
	});
}

function constructAuthorize(authorisationReference){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"authorize" + "&txtId="+authorisationReference,
		success: function(html){
			value = JSON.parse(html);
			if (value.error==true) {
				length = value.aut.length;
				if (length==0) {
					//nothing has been added yet do not append anything
					//msg = value.error_msg;
					//$(".flatDetails").append('<span>'+msg+'</span>');
				}else{
					for (var i = 0; i < length; i++) {
						$(".manage-default").find("table").append('<tr><td>'+ value.aut[i].req_ref +'</td><td>'+value.aut[i].aut_date+'</td><td>'+value.aut[i].aut_no+'</td><td><select class="manageAuthorisation"><option selected>Action</option><option class='+value.aut[i].aut_id+'>Update Authorization</option><option class='+value.aut[i].aut_id+'>Withdraw Authorization</option></select></td></tr>');
					}
				}
				///window.location.replace("index.html");
			}else{
				//error messages goes here
				msg = value.error_msg;
				//$(".flatDetails").append('<span>'+msg+'</span>');
			}
		},
		beforeSend: function(){
			//error messages
		}
	});
}

function constructForSigning(authorisationReference){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"signing" + "&txtId="+authorisationReference,
		success: function(html){
			value = JSON.parse(html);
			if (value.error==true) {
				length = value.lo.length;
				if (length==0) {
					//nothing has been added yet do not append anything
					//msg = value.error_msg;
					//$(".flatDetails").append('<span>'+msg+'</span>');
				}else{
					for (var i = 0; i < length; i++) {
						$(".form-controls-sign-off").find("table").append('<tr><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td><button class="btnSignOff" id='+value.lo[i].aut_id+'>Mark as Signed</button></td></tr>');
					}
				}
				///window.location.replace("index.html");
			}else{
				//error messages goes here
				msg = value.error_msg;
				//$(".flatDetails").append('<span>'+msg+'</span>');
			}
		},
		beforeSend: function(){
			//error messages
		}
	});
}

function constructUpdateDetails(){
	refId = sessionStorage.getItem("autId");
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"authorizeUpdate" + "&txtId="+refId,
		success: function(html){
			value = JSON.parse(html);
			if (value.error==true) {
				length = value.aut.length;
				if (length==0) {
					//nothing has been added yet do not append anything
					//msg = value.error_msg;
					//$(".flatDetails").append('<span>'+msg+'</span>');
				}else{
					//fill in the values from here
					requesterReference = value.aut[0].req_ref;
					copies = value.aut[0].aut_no;
					$("#txtRequesterReferenceUpdate").val(requesterReference);
					$("#txtNumberOfCopiesUpdate").val(copies);
				}
				///window.location.replace("index.html");
			}else{
				//error messages goes here
				msg = value.error_msg;
				//$(".flatDetails").append('<span>'+msg+'</span>');
			}
		},
		beforeSend: function(){
			//error messages
		}
	});
}

function constructSigned(authorisationReference){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"loIssued"+"&txtId="+authorisationReference,
		success: function(html){
			value = JSON.parse(html);
			if (value.error==true) {
				length = value.lo.length;
				if (length==0) {
					//nothing has been added yet do not append anything
					//msg = value.error_msg;
					//$(".flatDetails").append('<span>'+msg+'</span>');
				}else{
					for (var i = 0; i < length; i++) {
						$(".form-controls-signed").find("table").append('<tr><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td>'+value.lo[i].amount+'</td></tr>');
					}
				}
				///window.location.replace("index.html");
			}else{
				//error messages goes here
				msg = value.error_msg;
				//$(".flatDetails").append('<span>'+msg+'</span>');
			}
		},
		beforeSend: function(){
			//error messages
		}
	});
}
function errorDisplay(txtClass, msg, status){
	if (status=="positive") {
		txtClass.hasClass("negative") ? txtClass.removeClass("negative") : txtClass.addClass(status);
	}else if(status=="negative"){
		txtClass.hasClass("positive") ? txtClass.removeClass("positive") : txtClass.addClass(status);
	}
	//txtClass.addClass(status);
	txtClass.css("display", "block");
	txtClass.find("p").text(msg);
	txtClass.fadeOut(3000, function(){	
		txtClass.css("display", "none");
	});
}
function renderMenu(){
	overlayRef = $(".connection-overlay");
	profileRef = $(".overlay-details");
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	overlayRef.css("display", "block");
	overlayRef.css("height", winH+"px");
	profileRef.css("display", "block");
}
function cancelMenu(){
	overlayRef = $(".connection-overlay");
	profileRef = $(".overlay-details");
	overlayRef.css("display", "none");
	profileRef.css("display", "none");
}
function refreshPage() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;

    function refresh() {
    	var str = "You might have new messages. Click ok to refresh";
    	if (confirm(str)) {
    		window.location.replace("index.html");
    	}
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(refresh, 600000);  // time is in milliseconds
    }
}
refreshPage();