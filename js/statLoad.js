let stat;
const id = +localStorage.getItem('user_id');
sendRequest('GET', 'http://localhost:3000/api/stat/' + id)
.then(res => {
    stat = new Stat(res.id, res.user_id, res.played, res.wins, res.singleCage, res.doubleCage, res.tripleCage, res.quadroCage);
    let elem = document.querySelector('.gray');
    elem.textContent = "Games played: " + stat.played;
    elem = document.querySelector('#quadroCage');
    elem.textContent = "4x cage: " + stat.quadroCage;
    elem = document.querySelector('#tripleCage');
    elem.textContent = "3x cage: " + stat.tripleCage;
    elem = document.querySelector('#doubleCage');
    elem.textContent = "2x cage: " + stat.doubleCage;
    elem = document.querySelector('#singleCage');
    elem.textContent = "1x cage: " + stat.singleCage;
    elem = document.querySelector('#destroyedCage');
    elem.textContent = "Ships destroyed: " + stat.getCageCount();
    elem = document.querySelector('#winRate');
    elem.textContent = "Win Rate: " + stat.getWinRate().toFixed(2) + "%";
})

    