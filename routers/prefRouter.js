const { Router } = require('express');
const { prefController } = require('../controllers/prefController.js');

const prefRouter = new Router();


prefRouter.post('/signup', prefController.dbSignUpHandler);
prefRouter.get('/:username', prefController.dbGetUser);





module.exports = { prefRouter };
