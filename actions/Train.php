<?php
load("Battle, BattleTrain, BattleTemp, Alien");
data("level");

if($me->battleID) {
	error("In a battle");
}

//get the players alien
$next = Alien::getNext(USER);
if(!$next) {
	error("You have no available aliens to train");
}

$battle = new Battle();
$battle->type = "training";
$battle->ownerID = USER;
$battle->turn = USER;
$battle->startTime = NOW();
$battle->environment = $me->location;
$battle->status = "accepted";
$battle->accepted = 2;
$battle->needed = 2;
$battle->update();

$id = ORM::lastID();
$me->battleID = $id;
$me->update();

$p = I("Alien")->get($next);

//create the temporary stats
I("BattleTemp")->create($id, $next, $p->attack, $p->defense, $p->speed);

//choose a species
$species = BattleTrain::choose($me->location);

$alien = new BattleTrain();
$alien->battleID = $id;
$alien->alienID = $p->alienID;
$alien->alienAlias = $species['speciesName'];
$alien->species = $species['speciesID'];
$alien->hp = $p->maxHP;
$alien->maxHP = $p->maxHP;

if($level == "1") {
	$alien->attack = $p->attack + rand(-1, 1);
	$alien->defense = $p->defense + rand(-1, 1);
	$alien->speed = $p->speed + rand(-1, 1);
	$alien->exp = $p->level * 10;
	$alien->level = $p->level;
} else if($level == "2") {
	$alien->attack = $p->attack + 15 + rand(-5, 5);
	$alien->defense = $p->defense + 15 + rand(-5, 5);
	$alien->speed = $p->speed + 15 + rand(-5, 5);
	$alien->exp = ($p->level + 5) * 10 + rand(-5, 5);
	$alien->level = $p->level + 5;
} else {
	$alien->attack = $p->attack + 55 + rand(-10, 10);
	$alien->defense = $p->defense + 55 + rand(-10, 10);
	$alien->speed = $p->speed + 55 + rand(-10, 10);
	$alien->exp = ($p->level + 10) * 10 + rand(-10, 10);
	$alien->level = $p->level + 10;
}

$alien->update();

$data = array("battle" => $battle, "alien" => $p, "opp" => $alien);
echo json_encode($data);
?>