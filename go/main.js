$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});
jQuery('document').ready(function(){
	//main tabs
	let remote = require('electron').remote;
	let win = remote.BrowserWindow;

	//secId = getuserId("sessionIdSec");
	constructRequest();
	constructForIssuing();
	constructIssued();
	constructQued();
	// if (secId!=="") {
	// 	//alert(adminId);
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "http://192.168.43.13/Mcpaeis/public/php/get_first_name.php",
	// 		data: "txtId="+secId+"&txtTable="+"admin",
	// 		success: function(html){
	// 			value = JSON.parse(html);
	// 			if (value.error==true) {
	// 				name = value.fname;
	// 				indexName = name.substring(0,1);
	// 				//document.getElementById("image").innerHTML=indexName;
	// 				///window.location.replace("index.html");
	// 			}else{
	// 				//error messages goes here
	// 				alert(value.error_msg);
	// 			}
	// 		},
	// 		beforeSend: function(){
	// 			//error messages
	// 		}
	// 	});
	// }else{
		
	// }
	$(".fab").on('click', function(){
		window.location.replace("index.html");
	});

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
		var txtClass = $(".form-controls-msg");
		var form = $(".form-controls-table");
		if(formControls.css("display")=="none"){
			formControls.css("display", "block");
			//hide the other views
			formControlsSignOff.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");
			//authorize request form controls
			cl = formControls.find('.txtQue');
			length = cl.length;
			//console.log(length);
			for (var i = 0; i < length; i++) {
				cl[i].onclick=function(){
					val = $(this).val();
					classId = $(this).attr('id');
					//console.log(classId);
					sessionStorage.setItem("quedId", classId);
					$.ajax({
						type: "POST",
						url: "https://mathknust.000webhostapp.com/public/php/go_qued.php",
						data: "idToQue="+classId,
						success: function(html){
							value = JSON.parse(html);
							if (value.error==true) {
								status = "positive";
								msg = "Recommendation qued!";
								errorDisplay(txtClass, msg, status);
								$(form).fadeOut(2000, function(){
									form.fadeIn().delay(2000);
									window.location.replace("index.html");
								});
								//alert("");
		    					//window.location.replace("http://192.168.43.13/Mcpaeis/go/index.html");
							}else{
								//error messages goes here
								//alert(value.error_msg);
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
	manageAuthorized.on('click', function(){
		var txtClass = $(".form-controls-mng-msg");
		var form = $(".manage-default");
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
					//console.log(sessionStorage["flatId"]);
					if(val=="Delete"){
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
										status = "positive";
										msg = "Recommendation deleted!";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
										//alert("Recommendation deleted!");
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/go/index.html");
									}else{
										//error messages goes here
										//alert(value.error_msg);
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
		var txtClass = $(".form-controls-issue-msg");
		var form = $(".form-controls-issue-table");
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
					sessionStorage.setItem("issuedId", classId);
					$.ajax({
						type: "POST",
						url: "https://mathknust.000webhostapp.com/public/php/go_issued.php",
						data: "idToIssue="+classId,
						success: function(html){
							value = JSON.parse(html);
							if (value.error==true) {
								status = "positive";
								msg = "Recommendation issued!";
								errorDisplay(txtClass, msg, status);
								$(form).fadeOut(2000, function(){
									form.fadeIn().delay(2000);
									window.location.replace("index.html");
								});
								//alert("");
		    					//window.location.replace("http://192.168.43.13/Mcpaeis/go/index.html");
							}else{
								//error messages goes here
								//alert(value.error_msg);
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
	
	//authorization actions
	$("#manageAuthorisation").change(function(){
		//display the update view and hide the main
		val = $(this).val();
		if (val=="Update Authorization") {
			manageView.css('display', 'block');
			manageDefault.css('display', 'none');
		}else if(val=="Delete"){
			var option = confirm("This action is irreversible!");
			if(option){
				//delete the entry from the system
				alert('Recommendation Deleted');
			}else{
				//stay back there...
			}
		}
	});
	$("#txtAuthorizeRequestUpdate").on('click', function(e){
		e.preventDefault();
		//display the current values in their respective boxes
		var txtReference = $("#txtRequesterReferenceUpdate").val();
		var txtCopies = $("#txtNumberOfCopiesUpdate").val();
		if(txtReference==""){
			alert('Please Input a valid reference');
		}else if(txtCopies=="Copies"){
			alert("Please select valid number of copies");
		}else{
			//everything is good---an ajax function to send the request to go
			//display the default
			manageView.css('display', 'none');
			alert('Request Updated');
			manageDefault.css('display', 'block');
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

function constructRequest(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"requestGo",
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
						$(".form-controls").find("table").append('<tr><td>'+value.lo[i].recommender+'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].req_ref+'</td><td>'+value.lo[i].aut_no+'</td><td>Ghc'+value.lo[i].amount+'</td><td><input type="submit" class="submit txtQue" id='+value.lo[i].lo_id+' name="txtAuthorizeRequest" value="Que" /></td></tr>');
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

function constructForIssuing(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"goIssue",
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
						$(".form-controls-sign-off").find("table").append('<tr><td>'+ value.lo[i].recommender +'</td><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td><button class="btnSignOff" id='+value.lo[i].aut_id+'>Mark as Issued</button></td></tr>');
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
function constructIssued(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"issuedAdmin",
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
						$(".form-controls-signed").find("table").append('<tr><td>'+ value.lo[i].recommender +'</td><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td>'+value.lo[i].amount+'</td></tr>');
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

function constructQued(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"goIssue",
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
						$(".manage-default").find("table").append('<tr><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td><select class="manageAuthorisation"><option selected>Action</option><option class='+value.lo[i].aut_id+'>Delete</option></select></td></tr>');
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