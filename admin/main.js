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
	const fs = require("fs");
	const ipc = require('electron').ipcRenderer
	var print_control = $("#print-control");
	var print_prev = $(".form-controls-signed-prev");
	var print_signed = $(".form-controls-signed-print");
	var left_panel = $(".left-panel");
	print_signed.hide();

	$("#print").on("click", function(event){
		left_panel.hide();
		ipc.send('print-to-pdf');

	});
	ipc.on('wrote-pdf', function(event, path){
		print_signed.css("display", "none");
		print_prev.css("display", "block");
		print_control.css("display", "block");
		window.location.replace("index.html");
	});


	mSession = remote.session;
	//expTD = expiryDate(1);

	//setCookie("devsix", "learn to program", expTD, mSession, "http://localhost");

	mSession.defaultSession.cookies.get({name:'sessionIdAdmin'}, (err, cookies) => {
		 localStorage["adminId"] = cookies[0].value;
	});

	$(".fab").on('click', function(){
		window.location.replace("index.html");
	});
	//generatePassword();
	//call the construct flat details method
	$('table').tablesort();
	constructFlatDetails();
	constructRDDetails();
	constructIssued();
	constructRecommendersForManaging();
	adminId = localStorage["adminId"];
	// if (adminId!=="") {
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "http://192.168.43.13/Mcpaeis/public/php/get_first_name.php",
	// 		data: "txtId="+adminId+"&txtTable="+"admin",
	// 		success: function(html){
	// 			value = JSON.parse(html);
	// 			if (value.error==true) {
	// 				name = value.fname;
	// 				indexName = name.substring(0,1);
	// 				document.getElementById("image").innerHTML=indexName;
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
	//main tabs
	var authorizeRequest = $(".authorize-request-lo");
	var authorizeRequestGO = $(".authorize-request-go");
	var settings = $(".settings");
	var viewSignedRecommendation = $(".signed-recommendations");
	var manageAuthorized = $(".manage-authorized-request");
	
	//tab views
	var formControls = $('.form-controls');
	var formControlsGO = $('.form-controls-go');
	var formControlsSettings = $('.form-controls-settings');
	var formControlsSigned = $('.form-controls-signed');
	var formControlsManage = $('.form-controls-manage');
	var manageView = $('.manage-view');
	var manageDefault = $('.manage-default');

	//settings views
	var displayDetails = $('.displayDetails');
	var displayEditDetails = $('.displayEditDetails');
	var categorySelect = $('#categorySelect'); //category select
	var flatDetails = $('.flatDetails');
	var flatAction = $('.flatAction'); //select option for flat
	var reducingBalanceDetails = $('.reducingBalanceDetails');
	var RDAction = $('.RDAction'); //select option for RD
	var editFlat = $('.editFlat')
	var categoryChangeFlat = $('#categoryChangeFlat'); //change to RD
	var editReducingBalance = $('.editReducingBalance');
	var categoryChangeRD = $('#categoryChangeRD'); //change to flat
	var CRD = $('.CRD'); //display additional inputs when category changes from flat to RD
	var flatDefault = $('.flatDefault'); 
	var RDDefault = $('.RDDefault');
	var CFlat = $('.CFlat'); //display less inputs when category changes from RD to flat
	var categoryAddSelect = $('#categoryAddSelect'); //select add category
	var flatAdd = $('.flatAdd');
	var reducingBalanceAdd = $('.reducingBalanceAdd');
	var updateRD = $('#updateRD');
	var updateFlat = $('#updateFlat');
	var hiddenInputCat = $('#txtCatEdit');
	var tableRowsPrinting = $("#pTable");
	var printButton = $(".apply");
	var from_date='';
	var to_date='';

	//settings manipulations
	//hide the invokable views
	//displayDetails.css('display', 'none');
	//displayEditDetails.css('display', 'none');
	reducingBalanceDetails.css('display', 'none');
	flatDetails.css('display', 'none');
	editFlat.css('display', 'none');
	editReducingBalance.css('display', 'none');
	CRD.css('display', 'none');
	CFlat.css('display', 'none');
	flatAdd.css('display', 'none');
	reducingBalanceAdd.css('display', 'none');
	$(".date-range").css("display", "none");

	//program the generalized cancel button that reloads the page
	$(".cancel").on('click', function(e){
		e.preventDefault();
		window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
	});
	//manipulate the printing functions here
	$('input[type=radio][name=print-range]').change(function() {
        if (this.value == 'all') {
        	//this where you call the right ajax function
            $(".date-range").css("display", "none");
        }
        else if (this.value == 'custom') {
            $(".date-range").css("display", "block");
        }
    });


	$(function(){
		$.datepicker.setDefaults({
			dateFormat: 'yy-mm-dd'
		});
		from = $("#from")
		.datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		})
		.on("change", function(){
			//$("#pTable tr").not('thead tr').remove();
			from_date = $("#from").val();
			to_date = $("#to").val();
			to.datepicker("option", "minDate", from_date);

		}),
		to = $("#to").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		})
		.on("change", function(){
			//tableRowsPrinting.hide();
			from_date = $("#from").val();
			to_date = $("#to").val();
			from.datepicker("option", "maxDate", to_date);
		});

		function getDate(element){
			var date;
			try{
				date = $.datepicker.parseDate($.datepicker._defaults.dateFormat, element);
			}catch(error){
				console.log(error);
			}
			return date;
		}
	});
	print_control.on("click", function(){
		print_signed.show();
		print_prev.css("display", "none");
		print_control.css("display", "none");
		print_signed.css("margin-top", -140);
    	constructIssuedForPrinting('', '');
    	printButton.on("click", function(){
    		$("tbody").find("tr").remove();
			//console.log(from_date);
			//console.log(to_date);
    		constructIssuedForPrinting(from_date, to_date);
    	});
    	
	});
	//listen to the select change event
	categorySelect.change(function(){
		var txtClass = $(".form-controls-catedit-msg");
		var form = $(".categoryDetails");
		val = $(this).val();
		if (val=="Flat") {
			flatDetails.css('display', 'block');
			reducingBalanceDetails.css('display', 'none');
			displayEditDetails.css('display', 'none');
			cl = flatDetails.find('.flatAction');
			length = cl.length;
			for (var i = 0; i < length; i++) {
				cl[i].onchange=function(){
					val = $(this).val();
					classId = $(this).find('option:selected').attr('class');
					sessionStorage.setItem("flatId", classId);
					//console.log(sessionStorage["flatId"]);
					if (val=="Edit") {
						//display the flat edit class
						displayEditDetails.css('display', 'block');
						editFlat.css('display', 'block');
						editReducingBalance.css('display', 'none');
					}else if(val=="Delete"){
						option = confirm('You are about to delete this category?');
						if (option) {
							//some code to the databaseidToUpdate = sessionStorage["flatId"];
							$.ajax({
								type: "POST",
								timeout: 10000,
								url: "https://mathknust.000webhostapp.com/public/php/delete_fee.php",
								data: "idToDelete="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										status = "positive";
										msg = "Category deleted!";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
									}else{
										//error messages goes here
										msg = value.error_msg;
										status = "negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								error: function(xmlhttprequest, textstatus, message){
									status = "negative";
									if(textstatus==="timeout") {
										errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        } else {
							            errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        }
								},
								beforeSend: function(){
									//error messages
								}
							});
						}
					}
				};
			};
			
		}else if(val=="Reducing Balance"){
			//console.log($(this).val());
			reducingBalanceDetails.css('display', 'block');
			flatDetails.css('display', 'none');
			displayEditDetails.css('display', 'none');
			cl = reducingBalanceDetails.find('.RDAction');
			length = cl.length;
			for (var i = 0; i < length; i++) {
				cl[i].onchange=function(){
					val = $(this).val();
					classId = $(this).find('option:selected').attr('class');
					sessionStorage.setItem("RDId", classId);
					if (val=="Edit") {
						//display the flat edit class
						displayEditDetails.css('display', 'block');
						editFlat.css('display', 'none');
						editReducingBalance.css('display', 'block');
					}else if(val=="Delete"){
						option = confirm('You are about to delete this category?');
						if (option) {
							$.ajax({
								type: "POST",
								timeout:10000,
								url: "https://mathknust.000webhostapp.com/public/php/delete_fee.php",
								data: "idToDelete="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										msg = "Category deleted!";
										status = "positive";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
									}else{
										//error messages goes here
										msg = value.error_msg;
										status = "negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								error: function(xmlhttprequest, textstatus, message){
									status = "negative";
									if(textstatus==="timeout") {
										errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        } else {
							            errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        }
								},
								beforeSend: function(){
									//error messages
								}
							});
						}
					}
				};
			};
			
		}
	});
	//listen to the flat action category change event
	categoryChangeFlat.change(function(){
		val = $(this).val();
		if (val=="Flat") {
			flatDefault.css('display', 'block');
			CRD.css('display', 'none');
		}else if(val=="Reducing Balance"){
			CRD.css('display', 'block');
			flatDefault.css('display', 'none');
		}
	});
	
	//listent to the RD category change event
	categoryChangeRD.change(function(){
		val = $(this).val();
		if (val=="Reducing Balance") {
			RDDefault.css('display', 'block');
			CFlat.css('display', 'none');
		}else if(val=="Flat"){
			CFlat.css('display', 'block');
			RDDefault.css('display', 'none');
		}
	});
	//listen to the add change events
	categoryAddSelect.change(function(){
		val = $(this).val();
		if (val=="Flat") {
			flatAdd.css('display', 'block');
			reducingBalanceAdd.css('display', 'none');
		}else if(val=="Reducing Balance"){
			flatAdd.css('display', 'none');
			reducingBalanceAdd.css('display', 'block');
		}
	});
	//listen to the update click event
	updateFlat.on('click', function(e){
		e.preventDefault();
		var txtClass = $(".form-controls-catedit-msg");
		var feeCategory = categoryChangeFlat.val();
		if (feeCategory=="Flat") {
			//get the new category name and amount per copy
			newCategoryName = $("#txtCategoryNameEditF").val();
			amount = $("#txtAmountPerCopyEditF").val();
			if (amount=="") {
				msg = "Please input a valid amount";
				status="negative";
				errorDisplay(txtClass, msg, status);
			}else if(newCategoryName==""){
				msg = "Please type a valid category name";
				status="negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to add to database
				idToUpdate = sessionStorage["flatId"];
				$.ajax({
					type: "POST",
					timeout:10000,
					url: "https://mathknust.000webhostapp.com/public/php/update_fee.php",
					data: "idToUpdate="+idToUpdate+"&txtCategoryNameEditF="+newCategoryName+"&txtAmountPerCopyEditF="+amount+"&categoryChangeFlat="+feeCategory,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "Category updated";
							status = "positive";
							errorDisplay(txtClass, msg, status);
							$(displayEditDetails).fadeOut(2000, function(){
								displayEditDetails.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status="negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}else if(feeCategory=="Reducing Balance"){
			// get the form fields for RD
			newCategoryName = $("#txtCategoryNameEditF").val();
			initialLimit = $("#txtInitialLimitEditF").val();
			amountPerInitialLimit = $("#txtAmountPerInitialLimitEditF").val();
			amountAdditionalCopy = $("#txtAmountPerAdditionalCopyEditF").val();
			if (newCategoryName=="" || initialLimit=="" || amountPerInitialLimit=="" || amountAdditionalCopy=="") {
				msg = "Please all fields are required";
				status="negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to database
				idToUpdate = sessionStorage["flatId"];
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/update_fee.php",
					data: "idToUpdate="+idToUpdate+"&txtCategoryNameEditF="+newCategoryName+"&txtInitialLimitEditF="+initialLimit+"&categoryChangeFlat="+feeCategory+"&txtAmountPerInitialLimitEditF="+amountPerInitialLimit+"&txtAmountPerAdditionalCopyEditF="+amountAdditionalCopy,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "Category updated";
							status = "positive";
							errorDisplay(txtClass, msg, status);
							$(displayEditDetails).fadeOut(2000, function(){
								displayEditDetails.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status="negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}
		//console.log(newCategory);
	});
	updateRD.on('click', function(e){
		e.preventDefault();
		var txtClass = $(".form-controls-catedit-msg");
		var feeCategory = categoryChangeRD.val();
		if (feeCategory=="Flat") {
			//get the new category name and amount per copy
			newCategoryName = $("#txtCategoryNameEditRD").val();
			amount = $("#txtAmountPerCopyEditRD").val();
			if (amount=="") {
				msg = "Please input a valid amount";
				status = "negative";
				errorDisplay(txtClass, msg, status);
			}else if(newCategoryName==""){
				msg = "Please type a valid category name";
				status = "negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to add to database
				idToUpdate = sessionStorage["RDId"];
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/update_fee.php",
					data: "idToUpdate="+idToUpdate+"&txtCategoryNameEditF="+newCategoryName+"&txtAmountPerCopyEditF="+amount+"&categoryChangeFlat="+feeCategory,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "Category updated";
							status = "positive";
							errorDisplay(txtClass, msg, status);
							$(displayEditDetails).fadeOut(2000, function(){
								displayEditDetails.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status = "negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}else if(feeCategory=="Reducing Balance"){
			// get the form fields for RD
			newCategoryName = $("#txtCategoryNameEditRD").val();
			initialLimit = $("#txtInitialLimitEditRD").val();
			amountPerInitialLimit = $("#txtAmountPerInitialLimitEditRD").val();
			amountAdditionalCopy = $("#txtAmountPerAdditionalCopyEditRD").val();
			if (newCategoryName=="" || initialLimit=="" || amountPerInitialLimit=="" || amountAdditionalCopy=="") {
				msg = "Please all fields are required";
				status = "negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to database
				idToUpdate = sessionStorage["RDId"];
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/update_fee.php",
					data: "idToUpdate="+idToUpdate+"&txtCategoryNameEditF="+newCategoryName+"&txtInitialLimitEditF="+initialLimit+"&categoryChangeFlat="+feeCategory+"&txtAmountPerInitialLimitEditF="+amountPerInitialLimit+"&txtAmountPerAdditionalCopyEditF="+amountAdditionalCopy,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "Category updated";
							status = "positive";
							errorDisplay(txtClass, msg, status);
							$(displayEditDetails).fadeOut(2000, function(){
								displayEditDetails.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status = "negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}
		//console.log(newCategory);
	});
	//listen to the add category click event
	$("#addCategory").on('click', function(e){
		e.preventDefault();
		var txtClass = $(".form-controls-catedit-msg");
		var categoryName = $("#txtCategoryNameAdd").val();
		var applicableFee = $("#categoryAddSelect").val();
		var form = $(".categoryAdd");
		if (applicableFee=="Flat") {
			//flat feee category---get the initial amount per copy
			amount = $("#txtAmountPerCopyAdd").val();
			if (categoryName=="" || amount=="") {
				msg = 'Please all fields are required';
				status = "negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to database
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/add_fee.php",
					data: "txtCategoryAddSelect="+applicableFee+"&txtCategoryNameAdd="+categoryName+"&txtAmountPerCopyAdd="+amount,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "category added";
							status = "positive";
							errorDisplay(txtClass, msg, status);
							$(form).fadeOut(2000, function(){
								form.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status = "negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}else if(applicableFee=="Reducing Balance"){
			//rd category --- get the form values
			initialLimit = $("#txtInitialLimitAdd").val();
			amountPerInitialLimit = $("#txtAmountPerInitialLimitAdd").val();
			amountPerAdditional = $("#txtAmountPerAdditionalCopyAdd").val();
			if (categoryName=="" || initialLimit=="" || amountPerInitialLimit=="" || amountPerAdditional=="") {
				msg = "Please all fields are required";
				status = "negative";
				errorDisplay(txtClass, msg, status);
			}else{
				//proceed to database
				$.ajax({
					type: "POST",
					timeout: 10000,
					url: "https://mathknust.000webhostapp.com/public/php/add_fee.php",
					data: "txtCategoryAddSelect="+applicableFee+"&txtCategoryNameAdd="+categoryName+"&txtInitialLimitAdd="+initialLimit+"&txtAmountPerInitialLimitAdd="+amountPerInitialLimit+"&txtAmountPerAdditionalCopyAdd="+amountPerAdditional,
					success: function(html){
						value = JSON.parse(html);
						if (value.error==true) {
							msg = "category added";
							status="positive";
							errorDisplay(txtClass, msg, status);
							$(form).fadeOut(2000, function(){
								form.fadeIn().delay(2000);
								window.location.replace("index.html");
							});
	    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
						}else{
							//error messages goes here
							msg = value.error_msg;
							status = "negative";
							errorDisplay(txtClass, msg, status);
						}
					},
					error: function(xmlhttprequest, textstatus, message){
						status = "negative";
						if(textstatus==="timeout") {
							errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        } else {
				            errorMsg = "Slow connection detected. Check your internet connection and try again!";
				            errorDisplay(txtClass, errorMsg, status);
				        }
					},
					beforeSend: function(){
						//error messages
					}
				});
			}
		}else{
			msg = "Please select a valid fee category";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}
	});
	
	//hide the other components
	formControls.css('display', 'none');
	//formControlsSignOff.css('display', 'none');
	formControlsManage.css('display', 'none');
	manageView.css('display', 'none');
	formControlsSettings.css('display', 'none');
	formControlsGO.css('display', 'none');
	
	//call the tab listener function
	viewSignedRecommendation.on('click', function(){
		if(formControlsSigned.css("display")=="none"){
			formControlsSigned.css("display", "block");
			//hide the other views
			formControls.css("display", "none");
			formControlsGO.css("display", "none");
			formControlsManage.css("display", "none");
			formControlsSettings.css("display", "none");
		}
	});
	authorizeRequest.on('click', function(){
		if(formControls.css("display")=="none"){
			formControls.css("display", "block");
			//hide the other views
			formControlsGO.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");
			formControlsSettings.css("display", "none");
		}
	});
	authorizeRequestGO.on('click', function(){
		if(formControlsGO.css("display")=="none"){
			formControlsGO.css("display", "block");
			//hide the other views
			formControls.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");
			formControlsSettings.css("display", "none");
		}
	});
	manageAuthorized.on('click', function(){
		var txtClass = $(".form-controls-managerec-msg");
		var form = $(".manage-default");
		if(formControlsManage.css("display")=="none"){
			formControlsManage.css("display", "block");
			//hide the other views
			formControlsGO.css("display", "none");
			formControlsSigned.css("display", "none");
			formControls.css("display", "none");
			formControlsSettings.css("display", "none");
			cl = manageDefault.find('.manageAuthorisation');
			length = cl.length;
			for (var i = 0; i < length; i++) {
				cl[i].onchange=function(){
					val = $(this).val();
					classId = $(this).find('option:selected').attr('class');
					//sessionStorage.setItem("autId", classId);
					//session storage does not offer you the ability to get the value immediately, local storage does
					localStorage["recMid"] = classId;
					//console.log(classId);
					if (val=="Resend Password") {
						//get the recommender id to retrieve the mail
						$.ajax({
								type: "POST",
								timeout: 10000,
								url: "https://mathknust.000webhostapp.com/public/php/get_mail.php",
								data: "txtId="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										//get the mail
										retrievedMail = value.mail;
										$("#txtResendPassword").val(retrievedMail);
									}else{
										//error messages goes here
										msg = value.error_msg;
										status = "negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								error: function(xmlhttprequest, textstatus, message){
									status = "negative";
									if(textstatus==="timeout") {
										errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        } else {
							            errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        }
								},
								beforeSend: function(){
									//error messages
								}
							});
						manageView.css('display', 'block');
						manageDefault.css('display', 'none');
					}else if(val=="Delete Recommender"){
						var option = confirm("This action is irreversible!");
						if(option){
							//delete the entry from the system
							$.ajax({
								type: "POST",
								timeout: 10000,
								url: "https://mathknust.000webhostapp.com/public/php/delete_recommender.php",
								data: "idToDelete="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										msg = "Recommender Deleted!";
										status="positive";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
									}else{
										//error messages goes here
										msg = value.error_msg;
										status="negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								error: function(xmlhttprequest, textstatus, message){
									status = "negative";
									if(textstatus==="timeout") {
										errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        } else {
							            errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        }
								},
								beforeSend: function(){
									//error messages
								}
							});
						}else{
							//stay back there...
						}
					}else if(val=="Suspend"){
						var option = confirm("You are about to suspend this account!");
						if(option){
							//delete the entry from the system
							//userId = getuserId("sessionIdAdmin");
							$.ajax({
								type: "POST",
								timeout: 10000,
								url: "https://mathknust.000webhostapp.com/public/php/update_recommender.php",
								data: "txtAction="+"suspend"+"&txtUserId="+classId,
								success: function(html){
									value = JSON.parse(html);
									if (value.error==true) {
										msg = "Recommender suspended!";
										status = "positive";
										errorDisplay(txtClass, msg, status);
										$(form).fadeOut(2000, function(){
											form.fadeIn().delay(2000);
											window.location.replace("index.html");
										});
				    					//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
									}else{
										//error messages goes here
										msg = value.error_msg;
										status = "negative";
										errorDisplay(txtClass, msg, status);
									}
								},
								error: function(xmlhttprequest, textstatus, message){
									status = "negative";
									if(textstatus==="timeout") {
										errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        } else {
							            errorMsg = "Slow connection detected. Check your internet connection and try again!";
							            errorDisplay(txtClass, errorMsg, status);
							        }
								},
								beforeSend: function(){
									//error messages
								}
							});
							
						}else{
							//stay back there...
						}
					}
				};
			};
		}
	});
	settings.on('click', function(){
		if(formControlsSettings.css("display")=="none"){
			formControlsSettings.css("display", "block");
			//hide the other views
			formControlsGO.css("display", "none");
			formControls.css("display", "none");
			formControlsSigned.css("display", "none");
			formControlsManage.css("display", "none");
		}
	});
	
	//add recommender form controls
	$("#txtAddSubmit").on('click', function(e){
		e.preventDefault();
		var form = $('#txtDivAdd');
		var txtFirstName = $("#txtAddFirstName").val();
		var txtLastName = $("#txtAddLastName").val();
		var txtEmail = $("#txtAddEmail").val();
		var password = $("#txtAddPassword").val();
		var pStatus = $("#txtAddGeneratePassword").val();
		var txtClass = $(".form-controls-msg");

		if(txtFirstName=="" ||txtLastName==""||txtEmail==""){
			msg = 'Please all fields are required';
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(pStatus=="Generate Password"){
			msg = "Please generate recommender password";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else{
			//everything is good---send mail to recommender
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/create_recommender.php",
				data: "txtAddEmail="+txtEmail+"&txtAddPassword="+password+"&txtAddFirstName="+txtFirstName + "&txtAddLastName="+txtLastName,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						msg = 'Recommnder added successfully!';
						status = "positive";
						errorDisplay(txtClass, msg, status);
						//window.location.replace("index.html");
						$(form).fadeOut(2000, function(){
							form.fadeIn().delay(2000);
							window.location.replace("index.html");
						});
					}else{
						//error messages goes here
						msg = value.error_msg;
						status = "negative";
						errorDisplay(txtClass, msg, status);
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					status = "negative";
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        } else {
			            errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
			return false;
		}
	});
	$("#txtAddGeneratePassword").on('click', function(e){
		e.preventDefault();
		var btnValue = $("#txtAddGeneratePassword").val();
		if (btnValue=="Generate Password") {
			var password = generatePassword();
			$("#txtAddPassword").val(password);
			$("#txtAddGeneratePassword").val("Password Generated");
			console.log(password);
		}else{
			return false;
		}
	});

	//add secretary-go form controls
	$("#txtAddSubmitGO").on('click', function(e){
		e.preventDefault();
		var txtFirstName = $("#txtAddFirstNameGO").val();
		var txtLastName = $("#txtAddLastNameGO").val();
		var txtEmail = $("#txtAddEmailGO").val();
		var password = $("#txtAddPasswordGO").val();
		var pStatus = $("#txtAddGeneratePasswordGO").val();
		var txtClass = $(".form-controls-go-msg");
		var form = $("txtDivAddGo");

		if(txtFirstName=="" ||txtLastName==""||txtEmail==""){
			msg = 'Please all fields are required';
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(pStatus=="Generate Password"){
			msg = 'Please generate secretary password';
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else{
			//everything is good---input the details to firebase and send mail to recommender
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/create_secretary.php",
				data: "txtAddEmail="+txtEmail+"&txtAddPassword="+password+"&txtAddFirstName="+txtFirstName + "&txtAddLastName="+txtLastName,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						msg = 'Secretary added successfully!';
						status = "positive";
						errorDisplay(txtClass, msg, status);
						$(form).fadeOut(2000, function(){
							form.fadeIn().delay(2000);
							window.location.replace("index.html");
						});
					}else{
						//error messages goes here
						msg = value.error_msg;
						status = "negative";
						errorDisplay(txtClass, msg, status);
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					status = "negative";
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        } else {
			            errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
			//return false;
		}
	});
	$("#txtAddGeneratePasswordGO").on('click', function(e){
		e.preventDefault();
		var btnValue = $("#txtAddGeneratePasswordGO").val();
		if (btnValue=="Generate Password") {
			var password = generatePassword();
			console.log(password);
			$("#txtAddPasswordGO").val(password);
			$("#txtAddGeneratePasswordGO").val("Password Generated")
		}else{
			return false;
		}
	});

	$("#txtResendSubmit").on('click', function(e){
		e.preventDefault();
		var txtClass = $(".form-controls-managerec-msg");
		var txtResendEmail = $("#txtResendPassword").val();
		var txtPassword = generatePassword();
		var form = $(".manage-view");
		if(txtResendEmail==""){
			msg = "Please Input a valid email";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else if(txtPassword==""){
			msg = "Could not generate password. Try again shortly";
			status = "negative";
			errorDisplay(txtClass, msg, status);
		}else{
			txtId = localStorage["recMid"];
			//everything is good---an ajax function to send the request to go
			//display the default
			//first update the user password and send the new one
			$.ajax({
				type: "POST",
				timeout: 10000,
				url: "https://mathknust.000webhostapp.com/public/php/reset_password.php",
				data: "txtId="+txtId+"&txtPassword="+txtPassword+"&txtEmail="+txtResendEmail,
				success: function(html){
					value = JSON.parse(html);
					if (value.error==true) {
						msg = 'Password update sent successfully!';
						status = "positive";
						errorDisplay(txtClass, msg, status);
						$(form).fadeOut(2000, function(){
							form.fadeIn().delay(2000);
							window.location.replace("index.html");
						});
						//window.location.replace("http://192.168.43.13/Mcpaeis/admin/index.html");
					}else{
						//error messages goes here
						msg = value.error_msg;
						status = "negative";
						errorDisplay(txtClass, msg, status);
					}
				},
				error: function(xmlhttprequest, textstatus, message){
					status = "negative";
					if(textstatus==="timeout") {
						errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        } else {
			            errorMsg = "Slow connection detected. Check your internet connection and try again!";
			            errorDisplay(txtClass, errorMsg, status);
			        }
				},
				beforeSend: function(){
					//error messages
				}
			});
		}
	});
	$("#withdrawAuth").on('click', function(){
		var option = confirm("This action is irreversible!");
		if(option){
			//delete the entry from the system
		}else{
			//stay back there...
		}
	});
	
	//controls---logout
	$("#controls-logout").on('click', function(){
		var option = confirm("Are you sure you want to logout?");
		if(option){
			//first remove session id cookie ../ load home page
			window.location.replace("../index.html");
		}else{
			//stay back there...
		}
	});
});

String.prototype.pick = function(min, max) {
    var n, chars = '';

    if (typeof max === 'undefined') {
        n = min;
    } else {
        n = min + Math.floor(Math.random() * (max - min + 1));
    }

    for (var i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }

    return chars;
};

// Credit to @Christoph: http://stackoverflow.com/a/962890/464744
String.prototype.shuffle = function() {
    var array = this.split('');
    var tmp, current, top = array.length;

    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array.join('');
};

function generatePassword(){
	var specials = '!@#$%^&*()_+{}:"<>?\|[];\',./~';
	var lowercase = 'abcdefghijklmnopqrstuvwxyz';
	var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var numbers = '0123456789';

	var all = specials + lowercase + uppercase + numbers;

	var password = '';
	password += specials.pick(1);
	password += lowercase.pick(1);
	password += uppercase.pick(1);
	password += all.pick(4, 10);
	password = password.shuffle();
	return password;
}

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
function constructFlatDetails(){
	$.ajax({
			type: "POST",
			url: "https://mathknust.000webhostapp.com/public/php/details.php",
			data: "txtCategory="+"Flat",
			success: function(html){
				value = JSON.parse(html);
				if (value.error==true) {
					length = value.flat.length;
					if (length==0) {
						//nothing has been added ye
						msg = value.error_msg;
						$(".flatDetails").append('<span>'+msg+'</span>');
					}else{
						for (var i = 0; i < length; i++) {
							$(".flatDetails").find("table").append('<tr><td>'+value.flat[i].c_name+'</td><td>'+value.flat[i].fee+'</td><td><select class="flatAction select"><option selected>Action</option><option class='+value.flat[i].c_id+'>Edit</option><option class='+value.flat[i].c_id+'>Delete</option></select></td></tr>');
						}

					}
					///window.location.replace("index.html");
				}else{
					//error messages goes here
					msg = value.error_msg;
					$(".flatDetails").append('<span>'+msg+'</span>');
				}
			},
			beforeSend: function(){
				//error messages
			}
		});
}
function constructRDDetails(){
	$.ajax({
			type: "POST",
			url: "https://mathknust.000webhostapp.com/public/php/details.php",
			data: "txtCategory="+"Reducing Balance",
			success: function(html){
				value = JSON.parse(html);
				if (value.error==true) {
					length = value.rd.length;
					if (length==0) {
						//nothing has been added ye
						msg = value.error_msg;
						$(".reducingBalanceDetails").append('<span>'+msg+'</span>');
					}else{
						for (var i = 0; i < length; i++) {
							$(".reducingBalanceDetails").find("table").append('<tr><td>'+value.rd[i].c_name+'</td><td>'+value.rd[i].limit+'</td><td>'+value.rd[i].amount_limit+'</td><td>'+value.rd[i].amount_additional+'</td><td><select class="RDAction select"><option selected>Action</option><option class='+value.rd[i].c_id+'>Edit</option><option class='+value.rd[i].c_id+'>Delete</option></select></td></tr>');
						}
						
					}
					///window.location.replace("index.html");
				}else{
					//error messages goes here
					msg = value.error_msg;
					$(".reducingBalanceDetails").append('<span>'+msg+'</span>');
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
						$(".form-controls-signed-prev").find("table").append('<tr><td>'+ value.lo[i].recommender +'</td><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td>'+value.lo[i].amount+'</td></tr>');
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

function constructIssuedForPrinting(begin_date, end_date){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"issuedAdminPrinting" +"&txtBeginDate="+begin_date+"&txtEndDate="+end_date,
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
						$(".form-controls-signed-print").find("tbody").append('<tr class="table-rows"><td>'+ value.lo[i].recommender +'</td><td>'+ value.lo[i].req_ref +'</td><td>'+value.lo[i].aut_date+'</td><td>'+value.lo[i].aut_no+'</td><td>'+value.lo[i].amount+'</td></tr>');
					}
					$(".form-controls-signed-print").find("tbody").append('<tr class="table-rows"><td>Total:</td><td></td><td></td><td>'+value.total_issued+'</td><td>Ghc '+ value.total_amount+'</td></tr>');
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
function constructRecommendersForManaging(){
	$.ajax({
		type: "POST",
		url: "https://mathknust.000webhostapp.com/public/php/details.php",
		data: "txtCategory="+"manageRecommenders",
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
						$(".manage-default").find("table").append('<tr><td>'+ value.aut[i].aut_name +'</td><td>'+value.aut[i].aut_date+'</td><td>'+value.aut[i].no_signed+'</td><td>'+value.aut[i].aut_status+'</td><td><select class="manageAuthorisation"><option selected>Action</option><br /><option class='+value.aut[i].aut_id+'>Suspend</option><br /><option class='+value.aut[i].aut_id+'>Resend Password</option><option class='+value.aut[i].aut_id+'>Delete Recommender</option></select><td/><tr/>');
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