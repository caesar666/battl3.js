/*******
*Author: Cesar Voginski
*
*
*Versions: 1.0-Beta
*Change log:
*---
*******/

mongojs = undefined;
ObjectId = undefined;
db = undefined;

exports.startMongo = function()
{
	mongojs = require('mongojs');
	var databaseUrl = "localhost/battle"; // "username:password@example.com/mydb"
	var collections = ["accounts","history"]
	db = mongojs.connect(databaseUrl, collections);
}

exports.checkName = function(name, callback)
{
	db.accounts.findOne(
		{
			name: name
		},
		function(err, account)
		{
			callback(account);
		}
	);
}

exports.login = function(user, password, callback, callbackError)
{
	db.accounts.findOne(
		{
			user: user,
			pass: password	
		},
		function(err, account)
		{
			if(err || !account)
			{
				if(callbackError)
					callbackError(err);		
			}
			else
			{
				callback(account);
			}
		}
	);
}

exports.findAccount = function(id, callback, callbackError)
{
	var oid = db.ObjectId(id);

	db.accounts.findOne(
		{
			_id : oid
		},
		function(err, account)
		{
			if(err || !account)
			{
				if(callbackError)
					callbackError(err);		
			}
			else
			{
				callback(account);
			}
		}
	);
}

exports.accountSave = function(account)
{
	db.accounts.save(account);
}

exports.historySave = function(history)
{
	db.history.save(history);
}

function findHistory(id, callback)
{
	var query = 
	{
		$or :
		[
			{
				playerId : id
			},
			{
				enemyId : id
			}
		]
	};

	db.history.find( query, { limit : 5 },
		function(err, historys)
		{
			callback(historys);
		}
	);
	
}

exports.findHistoryById = function(id, callback)
{
	db.history.findOne( { _id: db.ObjectId(id) },
		function(err, history)
		{
			callback(history);
		}
	);
	
}

exports.checkUser = function(user, callback)
{
	var r = db.accounts.findOne(
		{
			user: user
		},
		function(err, account)
		{
			callback(account != undefined);
		}
	);
}

exports.loadBattles = function(playerId, callback)
{
	var myBattles, worldBattles;
	
	findHistory(playerId, function(historys){
		myBattles = historys;
		
		db.history.find(
			{ useless : 1 },{ sort: [['date','desc'], ['useless','asc']], limit:5}, function(err, worldHistorys){
				worldBattles = worldHistorys;
				if(!worldBattles)
					worldBattles = undefined;
				callback(myBattles, worldBattles);
			});
	});
}






