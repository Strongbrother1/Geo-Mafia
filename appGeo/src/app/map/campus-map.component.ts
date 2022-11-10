import { Component, Inject, Injectable} from '@angular/core';
import {Bubble} from './map.component'
import {Player} from '../player/player.component'



@Component({
  selector: 'campusMap',
  templateUrl: './campus-map.component.html',
})

export class CampusMap{
  [x: string]: any; //this is to go in the forEach logic

  MapOfCampus: Array<Bubble>;
  display: Bubble;
  constructor() {
    //the MapOfCampus will be fully initialized on call, will need to make getters and setters

    this.MapOfCampus = new Array<Bubble>;

    // Initializing the Campus Map as one variable atm know as `Campus`
    var Campus =  new Bubble();
    Campus.init_bubble('Campus', 41.7949918, 41.7878145, -87.5964249, -87.6062370);
    var Player1 = new Player();
    var Player2 = new Player();

    //Players that will go in the `Campus` Bubble
    var P1point = {x: 41.7901, y: -87.5999 };
    Player1.init_Player(1, "SUUUper", P1point, true);
    var P2point = {x: 41.000001, y: -87.590001};
    Player2.init_Player(1, "FunnY_Name", P1point, true);

    // adding `Players` to the `List` within `Campus`
    Campus.addPlayer(Player1);
    Campus.addPlayer(Player2);
    this.addToMap(Campus);

    //idea:call PlayerInBubble to find `Player`'s current `Bubble`
        //display is currently set to Campus-- will implement further logic soon

    this.display = Campus;

    //console.log(this.display); //commented out, this is to see what was received

  }

    addToMap(Bubble){
      //this is a function solely for use in this file to add bubbles to our mapOfCampus
      this.MapOfCampus.push(Bubble);
    }

    playerInBubble(Player){
      //This will be the function to call to check if a player is in a Bubble within our list of Bubbles
      this.campusMap.forEach(this.checkBubble);
    }


    checkBubble(Bubble){
      //this is a function that calls on the bubble that is iterated through
      //when this is called on a bubble if true will change the bubble to display to the Player
      if(Bubble.inbubble(Player)){
        this.display = this.Bubble;
      };
    }

}

export default CampusMap;