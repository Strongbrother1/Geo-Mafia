import {Player} from 'src/app/map/player.component.js';

const player_tests = require('./map/player.component.js');

QUnit.module("player_tests");

const DEAD = 0
const ALIVE = 1
const SUCCESS = 10
const FAILURE = -10
const DAILYMAXKILLCOUNT = 2

export class Location{
    location // An int

    constructor(location){
        this.location = location
    }
}

const Location1 = new Location(1);
const Location2 = new Location(2);

const player1 = new Player(1, 'player1', Location1, ALIVE);

QUnit.test("a player gets killed", assert => {
    assert.equal(player1.getKilled(), SUCCESS);
    assert.equal(player1.alive, DEAD);
});

QUnit.test("takes a snapshot of player locations", assert => {
    assert.equal(player1.takeSnapshot(), SUCCESS);
});

QUnit.test("player opens a snapshot", assert => {
    assert.equal(player1.open_snapshot(), SUCCESS);
});

var playerMap = new Map();
playerMap.set('player2', Location1);
playerMap.set('player3', Location2);

// Need to user the player_class_declaration
QUnit.test("player checks the info of other people in the same bubble",
assert => {
    assert.equal(player1.see_people_in_bubble(playerMap), ['player2']);
});

QUnit.test("player opens a chat message", assert => {
    assert.equal(player1.open_chat(), SUCCESS);
});

QUnit.test("player sends out a chat message", assert => {
    assert.equal(player1.send_chat(message), SUCCESS);
});

QUnit.test("player receives a chat message", assert => {
    assert.equal(player1.receive_chat(message), SUCCESS);
});

QUnit.test("player votes for another player", assert => {
    assert.equal(player1.voteForExecution(player), SUCCESS);
});

const killer1 = new Killer(1, 'killer1', Location1, ALIVE);

QUnit.test("killer kills a player", assert => {
    assert.equal(killer1.kill_player(player_id, Players), SUCCESS);
});

QUnit.test("the total number of kills done by killer1 after 1 kill", assert => {
    assert.equal(killer1.get_total_kill_count(), 1);
});

QUnit.test("the total number of kills remaining for killer1 after 1 kill",
assert => {
    assert.equal(killer1.remaining_daily_kill_count(), (DAILYMAXKILLCOUNT-1));
});