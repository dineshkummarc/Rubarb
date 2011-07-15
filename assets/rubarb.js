//(function($, Crafty) {

var Login, Register, Battle, Training, Map, TrainScreen, Choose, Items, Aliens, 
	ME,
	ALIENS = [];

$(function() {
	Crafty.init(800, 600);
	
	Crafty.sprite("assets/images/aliens/animation.png", SPRITES);
	
	Login = Crafty.e("Room").Room("Login", "login");
	Register = Crafty.e("Room").Room("Register", "register");
	Choose = Crafty.e("Room").Room("Choose", "choose");
	Battle = Crafty.e("Room").Room("Battle", "battle-left, battle-right, battle-center, battle-menu");
	TrainScreen = Crafty.e("Room").Room("TrainScreen", "train-screen");
	Training = Crafty.e("Room").Room("Training", "train-left, train-right, train-menu");
	Map = Crafty.e("Room").Room("Map", "map");
	Aliens = Crafty.e("Room").Room("Aliens", "aliens");
	Items = Crafty.e("Room").Room("Items", "items");
	
	//check if logged in
	if(!ME) {
		api("IsLogged", function(data) {
			//if not logged in, show the login screen
			if(data.error) {
				Login.run();
			} else {
				//else set the data to ME
				ME = data;
			}
		}, false);
	}
});

/**
* Wrap AJAX request
*/
function api(action, data, callback, showError) {
	//allow empty data
	if(typeof data === "function") {
		showError = callback;
		callback = data;
		data = null;
	}
	
	//default to show error
	if(showError === undefined) {
		showError = true;
	}
	
	$.ajax("api.php?action=" + action, {
		dataType: "text",
		data: data,
		success: function(data) {	
			try {
			var data = eval('('+data+')');
			} catch(err) {
				console.log(data);
			}
			
			//if there is an error, automaticall display
			if(showError && data.error) {
				Dialog(data.error);
				return;
			}
			
			if(callback) callback(data);
		}
	});
};

function pull(list) {
	var frag = document.createDocumentFragment(),
		i = 0, ids = list.split(/\s*,\s*/), l = ids.length,
		elem;
		
	for(;i < l; ++i) {
		elem = document.getElementById(ids[i]);
		
		//remove from the tree
		elem.parentNode.removeChild(elem);
		
		frag.appendChild(elem);
	}
	
	return frag;
}

function Dialog(msg) {
	var $d = $("#dialog");
	$d.show().html(msg).animate({top: -4}, 150).delay(msg.length * 100)
		.animate({top: -50}, 150, function() {
			$(this).hide().html("");
		});
}

/**
* Container of Rooms
*/
var Rooms = (function() {
	var rooms = {},
		selected;

	return {
		/**
		* Add a Room to the collection
		*/
		add: function(id, room) {
			rooms[id] = room;
		},
		
		/**
		* Remove a room from the collection
		*/
		remove: function(id) {
			delete rooms[id];
		},
		
		/**
		* Select a Room by exiting the currently
		* selected room.
		*/
		select: function(id) {
			//exit the last room
			if(selected) {
				rooms[selected].exit();
			}
			
			selected = id;
		},
		
		debug: function() {
			console.log(rooms, selected);
		}
	};
})();

Crafty.c("Room", {
	frag: null,
	id: null,
	ids: null,
	
	Room: function(id, ids) {
		Rooms.add(id, this);
		
		//initialize the Room events
		if(window["init" + id]) {
			window["init" + id].call(this);
		}
		
		this.frag = pull(ids);
		this.id = id;
		this.ids = ids;
		
		return this;
	},
	
	run: function(data) {
		Rooms.select(this.id);
		
		Crafty.stage.elem.appendChild(this.frag);
		this.trigger("Run", data);
		return this;
	},
	
	exit: function() {	
		this.frag = pull(this.ids);
		
		this.trigger("Exit");
		return this;
	},
	
	menu: function() {
		
	}
});



//})(jQuery, Crafty);