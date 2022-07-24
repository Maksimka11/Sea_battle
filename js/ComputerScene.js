const countPlayer = [];
const countOpponent = [];
let livedships ;
let stat;

class ComputerScene extends Scene {
	untouchables = [];
	playerTurn = true;

	init() {
		countPlayer.push(document.querySelector(".ship-count.player.x4"),
						 document.querySelector(".ship-count.player.x3"),
						 document.querySelector(".ship-count.player.x2"),
						 document.querySelector(".ship-count.player.x1"));

		countOpponent.push(document.querySelector(".ship-count.opponent.x4"),
						   document.querySelector(".ship-count.opponent.x3"),
						   document.querySelector(".ship-count.opponent.x2"),
						   document.querySelector(".ship-count.opponent.x1"));
	}

	start(untouchables) {
		sendRequest('GET', 'http://localhost:3000/api/stat/' + user_id)
		.then(res => {
			stat = new Stat(res.id, res.user_id, res.played, res.wins, res.singleCage, res.doubleCage, res.tripleCage, res.quadroCage);
			sendRequest('PUT', 'http://localhost:3000/api/stat', {
								user_id: stat.user_id,
								played: stat.played + 1,
								wins: stat.wins,
								singleCage: stat.singleCage,
								doubleCage: stat.doubleCage,
								tripleCage: stat.tripleCage,
								quadroCage: stat.quadroCage
							}).then (() => {
								stat.played += 1
							})
		})
		livedships = [1, 2, 3, 4];
		const { opponent } = this.app;
		const randomButton = document.querySelector(".random");
		randomButton.classList.add("hidden");

		opponent.clear();
		opponent.randomize(ShipView);

		this.untouchables = untouchables;

		const repeatbutton = document.querySelector('[data-action="repeat"]');
		repeatbutton.addEventListener('click', () => {
			this.app.start("preparation");
		});

		this.setCounter(countPlayer);
		this.setCounter(countOpponent);
	}

	stop() {
		const repeatbutton = document.querySelector('[data-action="repeat"]');
		repeatbutton.removeEventListener('click', () => {
			this.app.start("preparation");
		});
	}

	update() {
		const { mouse, opponent, player } = this.app;

		const isEnd = opponent.loser || player.loser;

		const cells = opponent.cells.flat();
		cells.forEach((cell) => cell.classList.remove("battlefield-item__active"));

		if (isEnd) {
			if (opponent.loser) {
				document.querySelector('.battle-now').src = "prise.png";
				document.querySelector('.battle-text').textContent = "You win!!";
				sendRequest('PUT', 'http://localhost:3000/api/stat', {
								user_id: stat.user_id,
								played: stat.played,
								wins: stat.wins + 1,
								singleCage: stat.singleCage,
								doubleCage: stat.doubleCage,
								tripleCage: stat.tripleCage,
								quadroCage: stat.quadroCage
							})
			} else {
				document.querySelector('.battle-now').src = "sad.png";
				document.querySelector('.battle-text').textContent = "You lost..";
			}

			document.querySelector(".repeat").classList.remove("hidden");

			return;
		}

		if (isUnderPoint(mouse, opponent.table)) {
			const cell = cells.find((cell) => isUnderPoint(mouse, cell));

			if (cell) {
				cell.classList.add("battlefield-item__active");

				if (this.playerTurn && mouse.left && !mouse.pLeft) {
					const x = parseInt(cell.dataset.x);
					const y = parseInt(cell.dataset.y);

					const shot = new ShotView(x, y);
					const result = opponent.addShot(shot);

					if (result) {
						this.playerTurn = shot.variant === "miss" ? false : true;

						if (shot.variant === "killed") {							
							let counter = this.countShipStats(opponent);
							if (counter[0] != livedships[0])
								stat.quadroCage += 1;
							else if(counter[1] != livedships[1])
								stat.tripleCage += 1;
							else if(counter[2] != livedships[2])
								stat.doubleCage += 1;
							else if(counter[3] != livedships[3])
								stat.singleCage += 1;
							livedships = counter;
							this.updateCounter(counter, countOpponent);
							sendRequest('PUT', 'http://localhost:3000/api/stat', {
								user_id: stat.user_id,
								played: stat.played,
								wins: stat.wins,
								singleCage: stat.singleCage,
								doubleCage: stat.doubleCage,
								tripleCage: stat.tripleCage,
								quadroCage: stat.quadroCage
							}).then(res => {
								sendRequest('GET', 'http://localhost:3000/api/stat/' + user_id)
								.then(res => {
									stat = new Stat(res.id, res.user_id, res.played, res.wins, res.singleCage, res.doubleCage, res.tripleCage, res.quadroCage);
								})
							})
						}
					}
				}
			}
		}

		if (!this.playerTurn) {
			const x = getRandomBetween(0, 9);
			const y = getRandomBetween(0, 9);

			let inUntouchable = false;

			for (const item of this.untouchables) {
				if (item.x === x && item.y === y) {
					inUntouchable = true;
					break;
				}
			}

			if (!inUntouchable) {
				const shot = new ShotView(x, y);
				const result = player.addShot(shot);

				if (result) {
					this.playerTurn = shot.variant === "miss" ? true : false;
					if (shot.variant === "killed") {
						let counter = this.countShipStats(player);
						this.updateCounter(counter, countPlayer);
					}
				}
			}
		}
	}

	countShipStats(user) {
		let arr = [0, 0, 0, 0];

		for (let i = 0; i < 10; i++) {
			const ship = user.ships[i];
			if (!ship.killed) {
				arr[ship.size - 1] += 1;
			}
		}
		return (arr.reverse());
	}

	setCounter(countDivs) {
		countDivs[0].textContent = 1;
		countDivs[1].textContent = 2;
		countDivs[2].textContent = 3;
		countDivs[3].textContent = 4;
	}

	updateCounter(counter, countDivs) {
		for (let i = 0; i < 4; i++)
		{
			countDivs[i].textContent = counter[i];
		}
	}
}
