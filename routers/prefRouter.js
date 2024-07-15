const { Router } = require('express');
const { prefController } = require('../controllers/prefController.js');

const prefRouter = new Router();


prefRouter.post('/users/signup', prefController.dbSignUpHandler);
prefRouter.post('/preference/add', prefController.dbAddPreference);
prefRouter.get('/users/:username', prefController.dbGetUser);
prefRouter.get('/vactions/destionations', prefController.listPref);
prefRouter.get('/vactions/activity', prefController.listActivity);
prefRouter.get('/preference/all', prefController.dbGetAllPrefernces);


module.exports = { prefRouter };
