const { v4 } = require('uuid');
const uuid = v4;

//all of these are potential for sql injection, but we learend it in class so I digress. we could use prepered statments to avoid that
exports.prefController = {

    async listPref(req, res) {

        const json = require('../data/destinations.json');
        const destinations = json.destinations;
        res.status(200).send(destinations);

    },

    async listActivity(req, res) {
        const json = require('../data/destinations.json');
        const activities = json.vaction_types;
        res.status(200).send(activities);
    },

    //to sign up, use the key value of : "username": ..., "password":...
    async dbSignUpHandler(req, res) {

        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        const access_code = uuid();
        connection.execute(`insert into tbl_59_users(access_code,user_name,user_password) values('${access_code}','${req.body.username}','${req.body.password}')`);

        connection.end();
        res.status(200).send(`Successfuly inserted username and password, your access code is: ${access_code} `);
    },

    async dbGetUser(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        const username = await req.params.username;

        try {
            const user_id = await connection.query(`select id from tbl_59_users where user_name like '${username}'`);
            console.log(`Found user #${user_id[0][0].id}.`);
            res.status(200).send('Found User.');
            return user_id;
        } catch (err) {
            res.status(404).send('User not found.');
            return null;
        }

    },
    async dbCheckLoginInfo(username, password) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        try {
            const [user] = await connection.query('select * from tbl_59_users where user_name = ? and user_password = ?',
                [username, password]);
            res.status(200).send(`Successful connection, your access_code:${user[0].access_code}`);
            console.log(user);
        } catch (err) {
            console.log(err);
            res.status(404).send('User not found.');
        }
    },
    async dbAddPreference(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        try {
            const [user] = await connection.query('select * from tbl_59_preferences where access_code = ?', [req.body.access_code]);
            await connection.execute('insert into tbl_59_preferences values(?,?,?,?,?)',
                [req.body.access_code, req.body.start_date, req.body.end_date, req.body.destination, req.body.vaction_type]);

            res.status(200).send('Successfuly added prefernces.');

        } catch (err) {
            console.log(err);
            res.status(404).send('Access_code not found, or date format is wrong, try YYYY-MM-DD');
        }
    },

    async dbGetAllPrefernces(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        const [users] = await connection.query('select * from tbl_59_preferences');
        res.status(200).send(users);

    }







}


