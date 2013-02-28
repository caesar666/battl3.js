/*******
*Author: Cesar Voginski
*
*
*Versions: 1.1-Beta
*Change log:
*Author: Cesar Voginski - Bug fixes (items was a global var for all users @_@)
*
*******/

var battleSys = require('./system.js');
var util = require('util');

function setupPlayer(player, items, action)
{
		player.hp = battleSys.calcHp(player.vit);
		player.mp = battleSys.calcMp(player.wis);

		player.hpMax = player.hp;
		player.mpMax = player.mp;

		player.action = action;
		player.items = pseudoCloneItens(items);
}


function isBattleEnd(result, players)
{
	if(players[0].hp <= 0 || players[1].hp <= 0)
	{
		if(players[0].hp <= 0 && players[1].hp <= 0)
		{
			result.history.add(0, players[0], players[1], 'end', 'Draw Battl3.');
			
		}
		else if(players[0].hp <= 0)
		{
			players[1].wins++;
			players[0].loses++;
			players[0].hp = 0;

			result.history.add(0, players[0], players[1], 'end', players[1].name + ' won.');

			result.won = players[1].name;
			result.lose = players[0].name;		
		}
		else if(players[1].hp <= 0)
		{
			players[0].won++;
			players[1].loses++;
			players[1].hp = 0;

			result.history.add(0, players[0], players[1], 'end', players[0].name + ' won.');

			result.won = players[0].name;
			result.lose = players[1].name;		
		}

		return true;			
	}
	return false;
}

exports.battl3 = function(players)
{
	var items =
	[
		{
			name : 'Cure Potion',
			quantity: 3,
			code : 'curePotion'
		}
	];

	//TODO achar uma forma de criar instancia dessa variavel a cada iteração
	var action = 
	{
		ac : {},
		punch : function(target){ action.ac.code = 'punch'; action.ac.target = target.index },
		fire : function(target){ action.ac.code = 'fire'; action.ac.target = target.index },
		ice : function(target){ action.ac.code = 'ice'; action.ac.target = target.index },
		use : function(item, target){ action.ac.code = item.code; action.ac.target = target.index }
	};

	var result = {};
	var enemyReal;
	var playerRealResult;
	var msgSysReal = new Array();
	result.history = new Array();
	result.history.add = function(index, player, enemy, code, msg)
	{
			this.push({
				playerIndex : index,
				playerHP : player.hp,
				playerMP : player.mp,
	
				enemyHP : enemy.hp,
				enemyMP : enemy.mp,
	
				code : code,
				msg : msg
			});
	}; 

	players.forEach(function(player, index, array)
	{
		player.index = index;
		setupPlayer(player, items, action);
	});

	while(true)
	{
		var endBattle = false;

		endBattle = isBattleEnd(result, players);		

		if(endBattle)
			break;

		players.forEach(function(playerReal, index, array)
		{
			turnErr= '';
			if(index == 0)
				enemyIndex = 1;
			else
				enemyIndex = 0;
			enemyReal = array[enemyIndex];

		
			var turnErr = '';

			playerRealResult = playerReal;
			var player = pseudoClone(playerReal);
			player.action = playerReal.action;

			var enemy = pseudoClone(enemyReal);
			var msgSys = duplicate(msgSysReal);			
			var self = player;

			try
			{
				player.action.ac = {};
				eval(player.func);
				var ac = player.action.ac;
			}catch(err){turnErr = err;}
			
			if(!ac)
				ac  = { code : 'err' };
		
			var systemFunc = battleSys.system[ac.code];
			if(!systemFunc)
				systemFunc = battleSys.system.err;

			try
			{
				systemFunc(playerReal, enemyReal, players, ac, index, msgSysReal, result.history);
			}
			catch(err){console.log(err.stack);}
		});
	}

	result.msgsSys = msgSysReal;
	result.player = players[0];
	result.enemy = players[1];
	
	result.stringify = JSON.stringify(result);

	return result;
}

exports.getBattleHistory = function (player, enemy, result)
{
	var battleHistory = 
	{
		useless : 1,
		playerId : player._id,
		enemyId : enemy._id,
		player :
		{
			name : player.name
		},
		enemy :
		{
			name : enemy.name
		},
		stringify : result.stringify
	};

	return battleHistory;
}

function pseudoCloneItens(itens)
{
	var itensClone = new Array();
	itens.forEach(function(item, index, array){
		itensClone.push(pseudoCloneItem(item));
	});

	return itensClone;
}

function pseudoCloneItem(item)
{
	var tempUse = item.use;
	item.use = '';

	var neoItem = duplicate(item);
	neoItem.use = tempUse;
	item.use = tempUse;

	return neoItem;
}

function pseudoClone(player)
{
	var neoPlayer = {};

	neoPlayer.name = player.name;
	neoPlayer.hp = player.hp;
	neoPlayer.mp = player.mp;

	neoPlayer.hpMax = player.hp;
	neoPlayer.mpMax = player.mp;

	neoPlayer.index = player.index;
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

