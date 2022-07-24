const cardFirst = document.querySelector('.card.first.hidden');
const cardSecond = document.querySelector('.card.second.hidden');
const shipDatas = [{
  size: 4,
  direction: "row",
  startX: 10,
  startY: 345
}, {
  size: 3,
  direction: "row",
  startX: 10,
  startY: 390
}, {
  size: 3,
  direction: "row",
  startX: 120,
  startY: 390
}, {
  size: 2,
  direction: "row",
  startX: 10,
  startY: 435
}, {
  size: 2,
  direction: "row",
  startX: 88,
  startY: 435
}, {
  size: 2,
  direction: "row",
  startX: 167,
  startY: 435
}, {
  size: 1,
  direction: "row",
  startX: 10,
  startY: 480
}, {
  size: 1,
  direction: "row",
  startX: 55,
  startY: 480
}, {
  size: 1,
  direction: "row",
  startX: 100,
  startY: 480
}, {
  size: 1,
  direction: "row",
  startX: 145,
  startY: 480
}];

class PreparationScene extends Scene {
  draggedShip = null;
  draggedOffsetX = 0;
  draggedOffestY = 0;

  init() {
    const {
      player
    } = this.app;

    for (const {
      size,
      direction,
      startX,
      startY
    } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY);
      player.addShip(ship);
    }

    this.randomize = this.randomize.bind(this);
    this.fight = this.fight.bind(this);
  }

  start() {
    const {
      player,
      opponent
    } = this.app;
    opponent.clear();
    player.removeAllShots();
    player.ships.forEach(ship => ship.killed = false);
    this.manually();
    document.querySelector('.repeat').classList.add("hidden");
    document.querySelector('.battle-now').src = "swords.png";
    document.querySelector('.battle-text').textContent = "Fight!";
    document.querySelector(".random").classList.remove("hidden");
    document.querySelector('.card.first').classList.add("hidden");
    document.querySelector('.card.second').classList.add("hidden");
    const randomizeButton = document.querySelector('[data-action="randomize"]');
    randomizeButton.addEventListener('click', this.randomize);
  }

  stop() {
    const randomizeButton = document.querySelector('[data-action="randomize"]');
    randomizeButton.removeEventListener('click', this.randomize);
    const fightButton = document.querySelector('.swords');
    fightButton.removeEventListener('click', this.fight);
  }

  update() {
    const {
      mouse,
      player
    } = this.app;

    if (!this.draggedShip && mouse.left && !mouse.pLeft) {
      const ship = player.ships.find(ship => ship.isUnder(mouse));

      if (ship) {
        const shipRect = ship.div.getBoundingClientRect();
        this.draggedShip = ship;
        this.draggedOffsetX = mouse.x - shipRect.left;
        this.draggedOffsetY = mouse.y - shipRect.top;
        ship.x = null;
        ship.y = null;
      }
    }

    if (mouse.left && this.draggedShip) {
      const {
        left,
        top
      } = player.root.getBoundingClientRect();
      const x = mouse.x - left - this.draggedOffsetX;
      const y = mouse.y - top - this.draggedOffsetY;
      this.draggedShip.div.style.left = `${x}px`;
      this.draggedShip.div.style.top = `${y}px`;
    }

    if (!mouse.left && this.draggedShip) {
      const ship = this.draggedShip;
      this.draggedShip = null;
      const {
        left,
        top
      } = ship.div.getBoundingClientRect();
      const {
        width,
        height
      } = player.cells[0][0].getBoundingClientRect();
      const point = {
        x: left + width / 2,
        y: top + height / 2
      };
      const cell = player.cells.flat().find(cell => isUnderPoint(point, cell));

      if (cell) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        player.removeShip(ship);
        player.addShip(ship, x, y);
      } else {
        player.removeShip(ship);
        player.addShip(ship);
      }
    }

    if (this.draggedShip && mouse.delta) {
      this.draggedShip.toggleDirection();
    }

    if (player.complete) {
      document.querySelector('.battle-now').style.cssText = 'opacity: 1';
      const swords = document.querySelector('.swords');
      swords.addEventListener('click', this.fight);
    } else {
      document.querySelector('.battle-now').style.cssText = 'opacity: 0.3';
    }
  }

  manually() {
    const {
      player
    } = this.app;
    player.removeAllShips();

    for (const {
      size,
      direction,
      startX,
      startY
    } of shipDatas) {
      const ship = new ShipView(size, direction, startX, startY);
      player.addShip(ship);
    }
  }

  randomize() {
    const {
      player
    } = this.app;
    player.randomize(ShipView);

    for (let i = 0; i < 10; i++) {
      const ship = player.ships[i];
      ship.startX = shipDatas[i].startX;
      ship.startY = shipDatas[i].startY;
    }
  }

  fight() {
    cardFirst.classList.remove('hidden');
    cardSecond.classList.remove('hidden');
    document.querySelector('.battle-now').src = "swords_ready.png";
    this.startComputer();
  }

  startComputer() {
    const matrix = this.app.player.matrix;
    const withoutShipItems = matrix.flat().filter(item => !item.ship);
    let untouchables = [];
    untouchables = getRandomSeveral(withoutShipItems, 25);
    this.app.start("computer", untouchables);
  }

}