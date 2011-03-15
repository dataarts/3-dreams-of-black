
// Copyright Â© 2001 by Apple Computer, Inc., All Rights Reserved.
//
// You may incorporate this Apple sample code into your own code
// without restriction. This Apple sample code has been provided "AS IS"
// and the responsibility for its operation is yours. You may redistribute
// this code, but you are not permitted to redistribute it as
// "Apple sample code" after having made changes.

/**
 * @author jonobr1 http://jonobr1.com/
 */

function checkEmail(b){var c="";if(b==""){c="You didn't enter an email address.\n"}var a=/^.+@.+\..{2,3}$/;if(!(a.test(b))){c="Please enter a valid email address.\n"}else{var d=/[\(\)\<\>\,\;\:\\\"\[\]]/;if(b.match(d)){c="The email address contains illegal characters.\n"}}return c}function checkPhone(a){var b="";if(a==""){b="You didn't enter a phone number.\n"}var c=a.replace(/[\(\)\.\-\ ]/g,"");if(isNaN(parseInt(c))){b="The phone number contains illegal characters."}if(!(c.length==10)){b="The phone number is the wrong length. Make sure you included an area code.\n"}return b}function checkPassword(a){var b="";if(a==""){b="You didn't enter a password.\n"}var c=/[\W_]/;if((a.length<6)||(a.length>8)){b="The password is the wrong length.\n"}else{if(c.test(a)){b="The password contains illegal characters.\n"}else{if(!((a.search(/(a-z)+/))&&(a.search(/(A-Z)+/))&&(a.search(/(0-9)+/)))){b="The password must contain at least one uppercase letter, one lowercase letter, and one numeral.\n"}}}return b}function checkUsername(a){var b="";if(a==""){b="You didn't enter a username.\n"}var c=/\W/;if((a.length<4)||(a.length>10)){b="The username is the wrong length.\n"}else{if(c.test(a)){b="The username contains illegal characters.\n"}}return b}function isEmpty(a){var b="";if(a.length==0){b="The mandatory text area has not been filled in.\n"}return b}function isDifferent(a){var b="";if(a!="Can't touch this!"){b="You altered the inviolate text area.\n"}return b}function checkRadio(b){var a="";if(!(b)){a="Please check a radio button.\n"}return a}function checkDropdown(a){var b="";if(a==0){b="You didn't choose an option from the drop-down list.\n"}return b}function checkBirthday(f,a){var c=a;var g=new Date();var e=g.getFullYear();var b="";if(f>e-c||f==undefined||f==null||f==0||f==""){b="Unfortunately we cannot accept your registration at this time, sorry.\n"}return b};