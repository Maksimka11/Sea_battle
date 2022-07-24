class Stat {
    constructor (id, user_id, played, wins, singleCage, doubleCage, tripleCage, quadroCage, username = null) {
        this.id = id;
        this.user_id = user_id;
        this.played = played;
        this.wins = wins;
        this.singleCage = singleCage;
        this.doubleCage = doubleCage;
        this.tripleCage = tripleCage;
        this.quadroCage = quadroCage;
        this.username = username
   }


   getWinRate() {
        return this.wins / this.played * 100        
   }

   getCageCount() {
    return this.singleCage + this.doubleCage + this.tripleCage + this.quadroCage;
   }
}