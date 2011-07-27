/**
* Training Interface
*/
function initTraining(){
	var $trainlist = $("#train-list");
	$("#train-menu a.forfeit").click(function() {
		api("Forfeit", function() {
			Map.run();
		});
	});

	this.bind("Run", function(data) {
		update("train", "left", data.alien);
		update("train", "right", data.opp);
		
		var alienInfo = IDtoAlien[data.alien.species],
			oppInfo = IDtoAlien[data.opp.species],
			$list = $("#train-list .inner"),
			$pop = $("#train-pop"),
			alien = Crafty.e("Alien").Alien(alienInfo.name),
			opp = Crafty.e("Alien").Alien(oppInfo.name),
			
			LOCK = false;
			
		//position the aliens
		alien.flip();
		alien.position(200, 200);
		opp.position(600, 200);
		
		api("ListAttacks", {alien: data.alien.alienID}, function(moves) {
			var i = 0, l = moves.length, move, html = "";
			
			for(;i < l; ++i) {
				move = moves[i];
				html += "<div class='move' data-id='"+move.moveID+"'><h3>"+move.moveName+"</h3>Left: <b>"+move.amount+"</b> / <b>"+move.maxAmount+"</b> ";
				html += "Type: <b>"+move.moveType+"</b></div>";
			}
			
			$list.html(html);
			$list.find(".move").click(function() {
				if(LOCK) return;
				var indicator = $(this).find("b:first");
				indicator.html(Crafty.n(indicator.text()) - 1);
				
				var id = $(this).attr("data-id");
				LOCK = true;
				
				api("Spar", {move: id}, function(result) {
					console.log(result);
					var anim;
					
					runMove("train", result[0], alien, opp, result[0].me, function() {
						//wait between 1 - 2s for running the next move
						setTimeout(function() {
							runMove("train", result[1], opp, alien, result[1].opp, function() {
								LOCK = false;
							});
						}, Crafty.randRange(1000, 2000));
					});
				});
			});
		});
		
		
	});
}


/**
* Training Screen
*/
function initTrainScreen() {
	$("#train-screen a").click(function() {
		var choice = $(this).attr("name");
		
		api("Train", {level: choice}, function(data) {
			console.log(data);
			Training.run(data);
		});
	});
}