const { Router } = require('express');
const { prefController } = require('../controllers/prefController.js');

const prefRouter = new Router();


prefRouter.post('/users/signup', prefController.dbSignUpHandler);
prefRouter.post('/preference/add', prefController.dbAddPreference);
prefRouter.get('/users/access', prefController.dbGetUser); //username and password in body.
prefRouter.get('/vactions/destionations', prefController.listPref);
prefRouter.get('/vactions/activity', prefController.listActivity);
prefRouter.get('/preference/all', prefController.dbGetAllPrefernces);
prefRouter.post('/preference/modify', prefController.dbModifyPref);
prefRouter.get('/preference/best', prefController.findPrefDest);

module.exports = { prefRouter };
