var ircLib = require('irc');
var fs = require('fs');
var channel = ['##phalanxia', '##madison'];
var botname = 'Nezzybear';
var client = new ircLib.Client('irc.freenode.net', botname, {
	channels: channel,
	userName: botname,
	realName: 'Nezz'
});

client.addListener('message', function (from, to, message) {
    if (message.indexOf(botname) !== -1){
    	console.log(from + ' => ' + "ME: " + ': ' + message);
    	message.toLowerCase();
    	if (message.indexOf("leave")!== -1){
    		var quitmessage = 'Bye guys';
    		client.disconnect(quitmessage);
    	}
    }else{
		console.log(from + ' => ' + to + ': ' + message);
    }
});


client.addListener("join", function () {

});

client.addListener('pm', function (from, message) {
	var message = message.toLowerCase();
	if (message.indexOf("broadcast")!== -1){
		var edit = message.substring(10, message.length);
		var parsed = edit.split("!");
		var broadcastchannel = parsed[0];
		var broadcastmessage = parsed[1];
		client.say(broadcastchannel, broadcastmessage);
	}
});