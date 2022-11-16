import { Component, OnInit } from '@angular/core';
import { InjectableAnimationEngine } from '@nativescript/angular';
import { ChangeType } from '@nativescript/core';
import { Bubble } from '../map/map.component';
import {Chat, Message} from '../chat/chat_class_declaration'


const DEAD = 0
const ALIVE = 1
const DAILYMAXKILLCOUNT = 2
const SUCCESS = 10
const FAILURE = -10

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})



export class Player implements OnInit {
  userID: number // An int
  username: string // A String
  location // A Coordinate Object will update according to what player dev does
  alive: number // A Boolean int value
  votes: number // An int
  chat_lists: Array<Chat> // List of Chat Objects that Player is a part of

  constructor(){}

  init_Player(userID: number, username: string, location, alive: number){
    //I pushed things here because did not want to deal with injection atm
    this.userID = userID;
    this.username = username;
    this.location = location;//will change to what playerdev decides to do
    this.alive = alive;
    this.votes = 0;
  }

  ngOnInit(): void {
    //calls you want to make some base initialization when data is loaded in
  }

  getUserID(){
    return this.userID;
  }
  getUsername() : string {
    return this.username;
  }
  getLocation(){
    return this.location;
  }

  getAliveStatus(){
    return this.alive;
  }
  getVotes(){
    return this.votes;
  }

  getChatList(){
    return this.chat_lists;
  }

  getChat(chatID){
    for(var i = 0; i < this.chat_lists.length; i++){
        var curr_chat = this.chat_lists[i]
        if (curr_chat.getChatID() == chatID)
            return this.chat_lists[i];
    }
    // In case that accessing an unavailable chat
    return null
}
  getKilled(){
    this.alive = DEAD
    return SUCCESS
}

//commented out due to snapshot class not existing

/*
takeSnapshot(){
    const scene_capture = new Snapshot() //Create a Snapshot object
    // Note: Snapshot class not done yet, will want some function to add
    // all information required for a snapshot
    if (scene_capture == 1){
        return SUCCESS
    }
    return FAILURE
} */
/*
open_snapshot(Snapshot){
    const open = Snapshot.view()
    if (open == 1) {
        return SUCCESS
    }
    return FAILURE
} */


seePeopleInBubble(All_players: Player[]){
  // Take in as input list of all players in Game
  // The hash table maps each player's userID to the player's location
  var player_list = new Array();
  // Sift through Hash Table and find nearby players
  for (var i in All_players) {
      var curr_player = All_players[i];
      if (curr_player.getLocation() == this.getLocation() && curr_player.getAliveStatus() != DEAD) {
          player_list.push(All_players[i]);
      }
  }
  return player_list;
}


open_chat(chat){
    const open = chat.view()
    if (open == 1) {
        return SUCCESS
    }
    return FAILURE
}

 /* sendChatMessage: Insert a message that Player wants to send into a Chat
     * Input:
     *      - chatID: A chatID representing the Chat Object that should be modified
     *      - message: The string that the Player wants to send in chat
    */

sendChatMessage(chatID, message){
  var main_chat = this.getChat(chatID);

  if (this.getAliveStatus() == DEAD || main_chat == null){
      return FAILURE;
  }

  const msg = new Message(message);
  const sent = main_chat.insertMessage(msg);
  if (sent == SUCCESS) {
      return SUCCESS;
  }
  else {
      console.log("error occured during when inserting new message into Chat");
      return FAILURE;
  }
}


/* insertChat(): Inserts a Chat object into the Chat List field within Player Object */
insertChat(chat){
  this.chat_lists.push(chat)
  return SUCCESS;
}


/* display: Function that displays all messages in a specific Chat
     * Input:
     *      - chatID: The chat we are interseted in accessing
     * Output: Print out for Player all the message contents
    */
display(chatID){
  //First, retrieve the Chat Object interested in
  var main_chat = this.getChat(chatID);

  //Secondly, get list of messages from the Chat
  var messages_list = main_chat.history();

  //Lastly, loop through list of messages and display
  for (var i = 0; i < messages_list.length; i++){
      var curr_msg = messages_list[i];
      curr_msg.printMessage();
  }

  return SUCCESS;
}

/* voteForExecution(): Let current player vote for _another_ player to be executed
     * Input:
     *      - A Player ID that will get looked up on the main General Chat
    */
voteForExecution(voted_player_ID){
  if (this.getAliveStatus() == DEAD){
    return FAILURE;
  }

  var main_chat = this.getChat(1) //Which a player should always be added to General Chat
  var Voted = main_chat.getPlayer(voted_player_ID) //Which a player would never pick a user ID that isn't present in the chat
  Voted.increaseVoteCount();
  return SUCCESS;
}

/* increaseVoteCount(): Increase current Player's number of votes
     * Note: This function added for privacy concersn (don't want other players
     * directly modifying the field of another player)
    */
increaseVoteCount(){
  this.votes++;
}

  /* resetVotes(): Reset current Player's number of votes back down to 0
   * Note: This will be called at the end of each day / in vote process logic
  */
  resetVotes(){
      this.votes = 0;
  }

}

//========== Civilian Class =========
export class Civilian extends Player{
  /* Currently will be just the same as Player Superclass, however this info
  may change when implementing chat feature or in the future */
  constructor(userID, username, location, alive){
      super();
      super.init_Player(userID, username, location, alive); //will change once deal with injection issue that arose
  }
}


//======= Killer Class ==========
export class Killer extends Player{
  //Define some maximum amount of kills per day
  max_daily_kill_count: number //An integer
  remaining_daily_kill_count: number //An integer
  total_kill_count: number //An integer

  constructor(userID, username, location, alive){
    super();
    super.init_Player(userID, username, location, alive);
    this.max_daily_kill_count = DAILYMAXKILLCOUNT;
    this.remaining_daily_kill_count = DAILYMAXKILLCOUNT;
    this.total_kill_count = 0;
}

  getTotalKillCount(){
      return this.total_kill_count;
  }
  getRemainingDailyKillCount(){
      return this.remaining_daily_kill_count;
  }
  getMaxDailyKillCount(){
      return this.max_daily_kill_count;
  }

  /* killPlayer: Allows a killer to eliminate a Player from the game
   * Input:
   *      -player_id: Player ID of whoever will be eliminated
   *      -All_players: Hash Table that contains all players
   *
  */
  killPlayer(player_id, All_players){
      //Take in from Game Class Players hash table and remove player_id
      var people_can_be_killed = this.seePeopleInBubble(All_players)

      if (people_can_be_killed.includes(player_id) == false){
          // Then the person Killer attempted to kill is NOT in their own bubble
          // Invalid Move!
          return FAILURE;
      }
      if (this.getRemainingDailyKillCount() > 0 && this.getAliveStatus() == ALIVE){
          // Killer has kills remaining, victim is in bubble and alive, can kill
          player_id.getKilled();
          All_players.delete(player_id); //will delete the players from the map ... implementation of /bubble will need to be fixed
          this.total_kill_count++;
          this.remaining_daily_kill_count--;

         return SUCCESS;
      } else {
          // Notify User in some way that they don't have any kills left for the day
          return FAILURE;
      }
  }
}
module.exports = Player;


