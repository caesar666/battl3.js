/*******
*Author: Cesar Voginski
*
*
*Versions: 1.0-Beta
*Change log:
*---
*******/

var battleSys = require('./system.js');
var util = require('util');

var items =
[
	{
		name : 'Cure Potion',
		quantity: 3,
		use : function()
		{	
			action.ac = 'curePotion'
		}
	}
];

var action = 
{
	ac : '',
	punch : function(){ action.ac = 'punch';},
	fire : function(){ action.ac = 'fire';},
	ice : function(){ action.ac = 'ice';}
};

function setupPlayer(player)
{
	player.hp = 200+(player.vit*10);
	player.mp = player.wis*9;

	player.action = action;
	player.items = items;
}

function isBattleEnd(msgReal, msgSysReal, result, players)
{
	if(players[0].hp <= 0 || players[1].hp <= 0)
	{
		if(players[0].hp <= 0 && players[1].hp <= 0)
		{
			msgReal.push('Draw Battl3 ...');
		}
		else if(players[0].hp <= 0)
		{
			msgReal.push(players[1].name + ' won.');
			players[1].wins++;
			players[0].loses++;

			result.won = players[1].name;
			result.lose = players[0].name;		
		}
		else if(players[1].hp <= 0)
		{
			msgReal.push(players[0].name + ' won.');
			players[0].won++;
			players[1].loses++;

			result.won = players[0].name;
			result.lose = players[1].name;		
		}

		return true;			
	}
	return false;
}
exports.battl3 = function(players)
{
	var result = {};
	var enemyReal;
	var playerRealResult;
	var msgReal = new Array();
	var msgSysReal = new Array();

	players.forEach(function(player, index, array)
	{
		setupPlayer(player);
	});

	while(true)
	{
		var endBattle = false;

		endBattle = isBattleEnd(msgReal, msgSysReal, result, players);		

		if(endBattle)
			break;

		players.forEach(function(playerReal, index, array)
		{
			turnErr= '';
			if(index == 0)
				enemyIndex = 1;
			else
				enemyIndex = 0;

		
			var turnErr = '';

			enemyReal = array[enemyIndex];
			playerRealResult = playerReal;
			var player = pseudoClone(playerReal);
			player.action = playerReal.action;

			var enemy = pseudoClone(enemyReal);
			var msg = duplicate(msgReal);
			var msgSys = duplicate(msgSysReal);			
			var self = player;

			try
			{
				player.action.ac = '';
				eval(player.func);
				var ac = player.action.ac;
			}catch(err){turnErr = err;}
		
			if(turnErr || ac == '' || ac == ' ')
			{
				(turnErr != '')
				console.log('b error: '+turnErr.message+' ---\n '+ turnErr.stack);
			}

			try
			{
				battleSys.system[ac](playerReal, enemyReal, ac, msgReal, msgSysReal);		
			}catch(err){}

		});
	}

	result.msgs = msgReal;
	result.msgsSys = msgSysReal;
	result.enemy = enemyReal;
	result.player = playerRealResult;

	return result;
}

function pseudoClone(player)
{
	var neoPlayer = {};

	neoPlayer.hp = player.hp;
	neoPlayer.mp = player.mo;
	neoPlayer.str = player.str;
	neoPlayer.vit = player.vit;
	neoPlayer.wis = player.wis;
	neoPlayer.func = player.func;
	neoPlayer.items = player.items;
 
	return neoPlayer;
}

function duplicate(json)
{
	return JSON.parse(JSON.stringify(json));
}

