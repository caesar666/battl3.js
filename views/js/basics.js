
function get(id)
{
	return document.getElementById(id);
}

function reCalc(strId,vitId,wisId,pointsId)
{
	var str = get(strId).value;
	var vit = get(vitId).value;
	var wis = get(wisId).value;
	var pointsField = get(pointsId);	
	
	var total = 30;
	
	total -= str;
	total -= vit;
	total -= wis;
	pointsField.value = total;

	if(total >= 0)
		pointsField.style.color = "blue";
	if(total < 0)
		pointsField.style.color = "red";
}

function logoutForm()
{
	get('logout').onclick = function()
	{
		var home = get('home');
		home.action = '/toLogout';
		home.submit();
	};

	$(".dialog").dialog({modal : true, show : "blind", hide : "blind"});	
	$("#manual").dialog({autoOpen : false, modal : true, show : "blind", hide : "blind", height:'auto', width:'auto' });
}

var submitVar;
function applyBattleStyles()
{
	$(".dialog").dialog({autoOpen : false, modal : true, show : "blind", hide : "blind"});

	var selfFuncButton = $("#selfFuncButton");

	selfFuncButton.click(function(){
		$("#selfFunc").dialog("open");
	});

	hljs.initHighlightingOnLoad();

	$(document).ready(function() {
	  $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
	});
}

function checkName(field)
{
	var hiddenNameField = $('#nameHidden');

	if(field.value == '' || field.value == ' ')
	{
		$('#nameOK').css('display','none');
		$('#nameWarn').css('display','');
		$('#nameMsg').html('Choose a decent name pls.');
		return;
	}

	if(field.value == hiddenNameField.val())
	{
		$('#nameOK').css('display','none');
		$('#nameWarn').css('display','none');
		$('#nameMsg').html('');
		return;
	}

	var request = $.ajax({
		type: 'POST',
		url: '/check',
		data: {tryName : field.value},
		success:function(data){
			if(data == 'ok')
			{
				$('#nameOK').css('display','');
				$('#nameWarn').css('display','none');
				$('#nameMsg').html('This name is avaliable.');
			}			
			else
			{
				$('#nameOK').css('display','none');
				$('#nameWarn').css('display','');
				$('#nameMsg').html('This name is already in use.');
			}		
		}
	});

}
function manualOpen()
{
	var manual = $.ajax({
		type:'GET',
		url: '/manual',
		success:function(data)
		{
			$('#manual').html(data);
			$("#manual").dialog("open");

		}
	});	
}

function loadResult()
{
	
}


