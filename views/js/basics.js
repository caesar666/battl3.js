
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

function onloadHome()
{
	get('logout').onclick = function()
	{
		var home = get('home');
		home.action = '/toLogout';
		home.submit();
	};

	$(".dialog").dialog({modal : true, show : "blind", hide : "blind"});	
	$("#manual").dialog({autoOpen : false, modal : true, show : "blind", hide : "blind", height:'auto', width:'auto' });

	var url = 'http://'+window.location.href.split('/')[2]+'/battl3/';
	var id = $('#idhidden').val();

	$('#url').html(url + id);
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

function onloadRegiter()
{
	$(".dialog").dialog({modal : true, show : "blind", hide : "blind"});	

	$('#registerForm').submit(function(){

		var user = $('#user').val();
		var password = $('#password').val();
		var repassword = $('#repassword').val();

		var required = 'This field is required.';
		var sendRequest = false;

		if(!user || user == '')
		{
			$('#error_user').html(required);
			cancelRequest = true;
		}

		if(password != repassword)
		{
			$('#error_pass').html('Passwords dont match.');
			$('#error_pass').css('display','');

			cancelRequest = true;
		}

		if(!password || !repassword)
		{
			$('#error_pass').html(required);
			$('#error_pass').css('display','');

			cancelRequest = true;
		}
		return !cancelRequest;
	});
}

function checkRegister()
{
	$('#error_pass').html('');
	$('#error_user').html('');
}

function appendSpaceDiv(idAppendTo)
{
	var divLine = $('<div></div>');
	divLine.css('height',38);
	divLine.appendTo(idAppendTo);
}

function appendStepDiv(playerNumber, code, message, idAppendTo, count)
{
	var divLine = $('<div></div>');
	var divLineId = 'divLine' + count
	divLine.attr('class', 'divLine' + (playerNumber + 1));
	divLine.attr('id', divLineId);
	
	var divImg = $('<div></div>');
	var divImgId = 'divImg'+count;
	divImg.attr('class', 'imgdiv');
	divImg.attr('id', divImgId);
	
	var img = $('<img></img>');
	var src = '/imgs/icons/' + code + '.png';
	img.attr('src',src);

	var divMessage = $('<div>' + message + '</div>');

	var container = $('#cont');
	
	divLine.appendTo(idAppendTo);
	divImg.appendTo('#' + divLineId);
	img.appendTo('#' + divImgId);
	divMessage.appendTo('#' + divLineId);
	
}

function updateBars(initialStatus, step)
{
	var playerOneHpBar = (step.playerHP * 100) / initialStatus.playerOne.hp;
	var playerOneMpBar = (step.playerMP * 100) / initialStatus.playerOne.mp;

	var playerTwoHpBar = (step.enemyHP * 100) / initialStatus.playerTwo.hp;
	var playerTwoMpBar = (step.enemyMP * 100) / initialStatus.playerTwo.mp;
	
	$('#hp0').css('width', playerOneHpBar);
	$('#mp0').css('width', playerOneMpBar);
	
	$('#hp1').css('width', playerTwoHpBar);
	$('#mp1').css('width', playerTwoMpBar);
}

function getInitialStatus(result)
{
	return {
		playerOne :
		{
			hp : result.player.hpMax,
			mp : result.player.mpMax
		},
		playerTwo :
		{
			hp : result.enemy.hpMax,
			mp : result.enemy.mpMax
		}
	}
}

function battle(result, id)
{
	var faceUrl = 'http://www.facebook.com/sharer.php?u=';
	var url = 'http://'+window.location.href.split('/')[2]+'/hist/'+id;
	$('#shareFace').attr('href', faceUrl+url);
	
	var initialStatus = getInitialStatus(result);
	var history = result.history;
	var containerDiv = '#lines';
	var time = 500;
	var count = 0;

	setInterval(function(){
		if(count <= history.length )
		{
			try
			{
				$('#cont').animate({ scrollTop: 99999999}, 1000);
			
				var step = history[count];
				appendStepDiv(step.playerIndex, step.code, step.msg, containerDiv, count);
				appendSpaceDiv(containerDiv);
				updateBars(initialStatus, step);
			}catch(e){}		
		}
		
		if(count == history.length)
		{
			$('#cont').stop();
			$('#lines').css('overflow','auto');
			
			$('#medal_one').css('display','inline');
			$('#medal_two').css('display','inline');
			
		}
		
		count++;
	}, time);
}





