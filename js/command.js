let loginBtn = document.getElementById('loginIn');

function setCommand ( button, command ) {

	button.onclick = function(){
		command.execute();

		let i = 0;
		setInterval(function(){
			console.log(++i);
		}, 1000);
	}
}

// 宏命令
function McroCommand () {
	return {
		commandList: [],
		add: function( command ){
			this.commandList.push( command );
		},
		execute: function(){
			for(var i = 0, command; command = this.commandList[i++]; ){
				command.execute();
			}
		}
	};
}

// 回调方式实现的队列命令
function CrowedCommend () {
	return {
		commandList: [],
		current: 0,
		add: function( command ){
			this.commandList.push( command );
		},
		execute: function(){
			var command = this.commandList[this.current];
			if(command){
				command.execute();
			}
		},
		next: function(){
			this.current++;
			this.execute();
		}
	};
}

// 观察者实现队列命令
let ObserveCommand = function ( receiver ) {
	// Event
	return {
		commandList: [],
		current: 0,
		add: function( command ){
			this.commandList.push( command );
			Event.create('command').listen( 'command', triggerAction);
		},
		execute: function(){
			var command = this.commandList[this.current];
			console.log('this.current:_'+ this.current);
			if(command){
				command.execute();
			}
		}
	};

}

let refreshCommand = function( receiver, callback ){
	return {
		execute: function(){
			receiver.refresh(callback);
		}
	}
}


let nav = {
	refresh: function(callback){
		setTimeout(function(){
			console.log('refreshing nav');
			Event.create('command').trigger('command', 'by observer!');
			// callback();
		}, 1500);
	}
};

let aside = {
	refresh: function(callback){
		setTimeout(function(){
			console.log('refreshing aside');
			Event.create('command').trigger('command', 'by observer!');
			// callback();
		}, 3500);
	}
};

let content = {
	refresh: function(callback){
		setTimeout(function(){
			console.log('refreshing content');
			Event.create('command').trigger('command', 'by observer!');
			// callback();
		}, 3500);
	}
};

function triggerAction(msg){
	observeCommand.current++;
	observeCommand.execute();
}

// let microCommand = McroCommand();
// microCommand.add(refreshNavCommand);
// microCommand.add(refreshAsideCommand);

// let crowedCommend = CrowedCommend();
// let refreshNavCommand = refreshCommand( nav, function(){
// 	crowedCommend.next(); 
// });
// let refreshAsideCommand = refreshCommand( aside, function(){
// 	crowedCommend.next(); 
// });
// let refreshContentCommand = refreshCommand( content, function(){
// 	crowedCommend.next(); 
// });
// crowedCommend.add(refreshNavCommand);
// crowedCommend.add(refreshAsideCommand);
// crowedCommend.add(refreshContentCommand);

let refreshNavCommand = refreshCommand( nav);
let refreshAsideCommand = refreshCommand( aside);
let refreshContentCommand = refreshCommand( content);
let observeCommand = ObserveCommand();
observeCommand.add(refreshNavCommand);
observeCommand.add(refreshAsideCommand);
observeCommand.add(refreshContentCommand);

setCommand(loginBtn, observeCommand);