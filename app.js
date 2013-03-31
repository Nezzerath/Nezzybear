var ircLib = require('irc');
var fs = require('fs');
var twitter = require('ntwitter');
var read = require('read');
var Seq = require('seq');
var credentials = require('./credentials.js');
var t = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});
var botname = 'Nezzybear';
var admins = 'Nezzerath';
var client = new ircLib.Client('irc.freenode.net', botname, {
channels: ['##phalanxia', '##madison'],
userName: botname,
realName: 'Nezz'
});
var charsymbol = '$';
client.addListener('message', function (from, to, message) {
	if (message.indexOf(charsymbol) !== -1 && from == admins){
		console.log(from + ' => ' + "ME: " + ': ' + message);
		var message = message.toLowerCase();
		if (message.indexOf("irc") !== -1){
			var message = message.substring(5, message.length);
			var irc = new Object();
			if (message.indexOf("leave:") !== -1){
				var edit = message.split("leave:");
				var channel = edit[1];
				var channel = channel.substring(1, channel.length);
				irc.channel = channel;
				client.part(irc.channel);
			}else if (message.indexOf("join:") !== -1){
				var edit = message.split("join:");
				var channel = edit[1];
				var channel = channel.substring(1, channel.length);
				irc.channel = channel;
				client.join(irc.channel);
			}else{
				client.say(to, "err: invalid args.");
			}
		}
		if (message.indexOf("whois") !== -1){
			var edit = message.substring(7, message.length);
			client.whois(edit);
		}
		if (message.indexOf("tweet") !== -1){
			var twit = new Object();
			var edit = message.substring(7, message.length);
			if (message.indexOf("message:") !== -1){
				var edit = edit.split("message:");
				var tweet = edit[1];
				var tweet = tweet.substring(1, tweet.length);
				twit.tweet = tweet;
				t.updateStatus(twit.tweet, function (err, data) {
					if (err) console.log('Tweeting failed: ' + err);
					else console.log('Tweet Successful!');
				});
			}else{
				client.say(to, "err: invalid args.");
			};
		}else{
		console.log(from + ' => ' + to + ': ' + message);
	};
};
});
client.addListener("join", function () {
	t.verifyCredentials(function (err, data) {
		if (err) {
			console.log("Error verifying credentials: " + err);
			process.exit(1);
		}
	})
});
client.addListener('pm', function (from, message) {
	var message = message.toLowerCase();
	if (message.indexOf("broadcast") !== -1){
		var edit = message.substring(10, message.length);
		var parsed = edit.split("!");
		var broadcastchannel = parsed[0];
		var broadcastmessage = parsed[1];
		client.say(broadcastchannel, broadcastmessage);
}
});
client.addListener('whois', function (info){
	console.log(info);
	client.say('##phalanxia', info.user);
	client.say('##phalanxia', info.realname);
	client.say('##phalanxia', info.serverinfo);
	client.say('##phalanxia', info.channels);
	client.say('##phalanxia', info.host);
});

client.addListener('error', function(message) {
	console.log('error: ', message);
});