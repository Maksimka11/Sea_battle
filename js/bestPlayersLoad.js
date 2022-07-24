let stats = [];
sendRequest('GET', 'http://localhost:3000/api/stats')
.then(res => {
    for (i = 0; i < res.length; i++) {
        stats[i] = new Stat(res[i].id, res[i].user_id, res[i].played, res[i].wins, res[i].singleCage, res[i].doubleCage, res[i].tripleCage, res[i].quadroCage, res[i].username);
    }

    stats.sort((a, b) => b.getWinRate() - a.getWinRate());
    const elem = document.querySelector('.stats');

    for (i = 0; i < stats.length; i++) {
        elem.innerHTML += '<div class="shadow best-players p-1 bg-body rounded"><p class="player-login" >Player '+ stats[i].username + '</p><p class="win-rate" style="display: inline">Win rate: '+ stats[i].getWinRate().toFixed(2) + '%</p><p class="game-count">Game count: '+ stats[i].played + '</p></div>';
    }
})