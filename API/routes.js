const Router = require('express');
const router = new Router();
const controllers = require('./controllers');

router.get("/user", controllers.getUsers);
router.get("/userById/:id", controllers.getUserById);
router.get("/user/:username", controllers.getUser);
router.post('/user', controllers.postUser);
router.post('/stat', controllers.postStat);
router.get('/stat/:id', controllers.getStat);
router.get('/stats', controllers.getStats);
router.put('/stat', controllers.putStat);
module.exports = router;