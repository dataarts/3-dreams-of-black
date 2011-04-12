$(document).ready(function() {
	$('#get input[type=button]').click(function() {		
		var i = $(this).siblings('input:eq(0)').val();
		ROME.Backend.getTopListForIndex({'index':i, 'success':callbackSuccess, 'error':callbackError});
		return false;
	});
	
	$('#getone input[type=button]').click(function() {		
		var id = $(this).siblings('input:eq(0)').val();
		ROME.Backend.getUGO({'id':id, 'success':callbackSuccess, 'error':callbackError});
		return false;
	});
	
	$('#points input[type=button]').click(function() {		
		var id = $(this).siblings('input:eq(0)').val();
		ROME.Backend.addPoints({'id':id, 'success':callbackSuccess, 'error':callbackError});
		return false;
	});
	
	$('#stars input[type=button]').click(function() {		
		var id = $(this).siblings('input:eq(0)').val();
		ROME.Backend.addStars({'id':id, 'success':callbackSuccess, 'error':callbackError});
		return false;
	});
	
	$('#disabled input[type=button]').click(function() {		
		var id = $(this).siblings('input:eq(0)').val();
		var bool = $(this).siblings('select:eq(0)').children('option:selected').val();
		
		ROME.Backend.disableUGO({'id':id, 'bool': bool, 'success':callbackSuccess, 'error':callbackError});
		return false;
	});
	
	$('#add input[type=button]').click(function() {
		var data = $(this).siblings('input:eq(0)').val();
		ROME.Backend.addUGO({'data':data, 'success':callbackSuccess, 'error':callbackError});		
		return false;
	});
	
	var callbackSuccess = function(data) {
		$('#result').html(JSON.stringify(data));
	}
	
	var callbackError = function(data) {
		$('#result').html(data);
	}	
});