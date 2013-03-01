/*******
*Author: Cesar Voginski
*
*
*Versions: 1.0-Beta
*Change log:
*---
*******/
var u = require('util');
exports.system = 
{
	err : function (player, enemy, players, action, index, msgSys, history)
	{
		history.add(index, players[0], players[1], 'err', 'function has done something wrong O.o');
		msgSys.push({action: 'Error', result : player.name+' function has done something wrong O.o', actor : player});
	},

	punch : function (player, enemy, players, action, index, msgSys, history)
	{
		enemy = getTarget(players, action.target);

		var damage = player.str ;
		enemy.hp -= damage;
		
		msgSys.push({action : action, result : '-'+damage, actor : player});
		history.add(index, players[0], players[1], action.code, player.name + ' punched '+enemy.name+' in the face.');
	},

	fire : function (player, enemy, players, action, index, msgSys, history)
	{	
		enemy = getTarget(players, action.target);

		if(player.mp < calcFireCoast())
		{
			var msg = player.name + ' failed to cast.';
			msgSys.push({action : action, result : 'spell fail', actor : player});
			
			history.add(index, players[0], players[1], action.code, msg);
			return;	
		}
		var damage = calcFire(player.wis); 
		enemy.hp -= damage;
		player.mp -= calcFireCoast();
		
		var msg = player.name + ' burned ' + enemy.name +'.';
		msgSys.push({action : action, result : '-' + damage, actor : player });
		
		history.add(index, players[0], players[1], action.code, msg);
	},

	ice : function (player, enemy, players, action, index, msgSys, history)
	{
		enemy = getTarget(players, action.target);
		if(player.mp < calcIceCoast())
		{
			msgSys.push({action : action, result : 'spell fail', actor : player});
			var msg = player.name + ' failed to cast.';
			
			history.add(index, players[0], players[1], action.code, msg);
			return;
		}
		var damage = calcIce(player.wis); 	
		player.mp -= calcIceCoast();
		enemy.hp -= damage;
		enemy.str -= enemy.str * 0.1;
		
		var msg = player.name + ' freezes '+enemy.name+' so much.';
		msgSys.push({action : action, result : '-'+damage, actor : player});
		
		history.add(index, players[0], players[1], action.code, msg);
	},
	
	curePotion : function (player, enemy, players, action, index, msgSys, history)
	{
		target = getTarget(players, action.target);

		var items = player.items.filter(function(item, index, array){
			return (item.name == 'Cure Potion' && item.quantity > 0);
		});

		if(items && items[0])
		{
			target.hp += calcCurePotion();
			if(target.hp > target.hpMax)
				target.hp = target.hpMax;
				
			items[0].quantity --;

			var msg = player.name + ' used Cure Potion in ' + target.name + '.';
			msgSys.push({action : action, result : '+' + calcCurePotion(), actor : player});
			
			history.add(index, players[0], players[1], action.code, msg);
		}
		else
		{
			var msg = player.name + ' is out of Cure Potion.';
			msgSys.push({action : action, result : 0, actor : player});
			
			history.add(index, players[0], players[1], action.code, msg);
		}
	}
};

function getTarget(players, index)
{
	return players[index];	
}


exports.calcHp = function(vit)
{
	return 100+(vit*5);
}

exports.calcMp = function(wis)
{
	return wis * 8;
}

function calcPunch(str)
{
	return str * 1.5;
}
function calcFire(wis)
{
	return wis * 3;
}

function calcFireCoast()
{
	return 30;
}

function calcIce(wis)
{
	return wis * 1.1;
}

function calcIceCoast()
{
	return 15;
}

function calcCurePotion()
{
	return 30;
}
