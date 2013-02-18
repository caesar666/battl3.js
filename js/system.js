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
	err : function (player, enemy, action, msg, msgSys)
	{
		msg.push(player.name+' function has done something wrong O.o');
		msgSys.push({action: 'Error', result : player.name+' function has done something wrong O.o'});
	},

	punch : function (player, enemy, action, msg, msgSys)
	{
		var damage = player.str ;
		enemy.hp -= damage;
		
		msgSys.push({action : action, result : damage});
		msg.push(player.name + ' punched '+enemy.name+' in the face.');
	},

	fire : function (player, enemy, action, msg, msgSys)
	{
		if(player.mp < 18)
		{
			msgSys.push({action : action, result : 'spell fail'});
			msg.push(player.name + ' failed to cast.');
		}
		var damage = player.wis*3; 

		msgSys.push({action : action, result : damage });
		msg.push(player.name + ' burned ' + enemy.name +'.');
		
		enemy.hp -= damage;
	},

	ice : function (player, enemy, action, msg, msgSys)
	{
		if(player.mp < 10)
		{
			msgSys.push({action : action, result : 'spell fail'});
			msg.push(player.name + ' failed to cast.');
		}
		var damage = player.wis * 0.7; 	

		msgSys.push({action : action, result : damage});
		msg.push(player.name + ' freezes '+enemy.name+' so much.');

		enemy.hp -= damage;
		enemy.str -= enemy.str * 0.1;
	},
	
	curePotion : function (player, enemy, action, msg, msgSys)
	{
		var items = player.items.filter(function(item, index, array){
			return (item.name == 'Cure Potion' && item.quantity > 0);
		});

		if(items && items[0])
		{
			player.hp += 15;
			items[0].quantity --;

			msgSys.push({action : action, result : 15});
			msg.push(player.name + ' used Cure Potion.');
		}
		else
		{
			msgSys.push({action : action, result : 0});
			msg.push(player.name + ' is out of Cure Potion.');
		}
	}
};