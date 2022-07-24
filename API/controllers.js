const db = require('../js/db');

class Controllers {
    async getUsers(req, res) {
        const users = await db.query('SELECT * FROM "users"')
        res.json(users.rows);
    }

    async getUser(req, res) {
        const username = req.params.username;
        const user = await db.query('SELECT * FROM "users" where "username" = $1', [username]);
        res.json(user.rows[0]);
    }

    async postUser(req, res) {
        const {username, password} = req.body;
        const user = await db.query('INSERT into "users" ("username", "password") values ($1, $2) RETURNING *', [username, password]);
        res.json(user.rows[0]);
    }

    async postStat(req, res) {
        const {id} = req.body;
        const stat = await db.query('INSERT into "stats" ("user_id") values ($1) RETURNING *', [id]);
        res.json(stat.rows[0]);
    }

    async getStat(req, res) {
        const id = req.params.id;
        const stat = await db.query('SELECT * FROM "stats" where "user_id" = $1', [id]);
        res.json(stat.rows[0]);
    }

    async putStat(req, res) {
        const {user_id, played, wins, singleCage, doubleCage, tripleCage, quadroCage} = req.body;
        const stat = await db.query('UPDATE "stats" set "played" = $1, "wins" = $2, "singleCage" = $3, "doubleCage" = $4, "tripleCage" = $5, "quadroCage" = $6 where "user_id" = $7 RETURNING *', [played, wins, singleCage, doubleCage, tripleCage, quadroCage, user_id]);
        res.json(stat.rows[0]);
    }

    async getStats(req, res) {
        const stats = await db.query('SELECT * FROM "stats" JOIN "users" on "stats"."user_id" = "users"."id" where "played" >= 100');
        res.json(stats.rows);
    }

    async getUserById(req, res) {
        const id = req.params.id;
        const stat = await db.query('SELECT "username" FROM "users" where "id" = $1', [id]);
        res.json(stat.rows[0]);
    }
}

module.exports = new Controllers();