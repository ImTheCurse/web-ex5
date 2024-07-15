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
            if (calculateDayOffset(req.body.start_date, req.body.end_date) > 7) {
                res.status(400).send('length of date is more than a week, enter dates smaller than a week.');
                return;

            }
            const [user] = await connection.query('select * from tbl_59_preferences where access_code = ?', [req.body.access_code]);
            await connection.execute('insert into tbl_59_preferences values(?,?,?,?,?)',
                [req.body.access_code, req.body.start_date, req.body.end_date, req.body.destination, req.body.vaction_type]);

            res.status(200).send('Successfuly added prefernces.');

        } catch (err) {
            console.log(err);
            res.status(404).send('Access_code not found, or date format is wrong, try YYYY-MM-DD, or prefernce already submitted.');
        }
    },

    async dbGetAllPrefernces(req, res) {
        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        const [users] = await connection.query('select start_date,end_date,destination,vaction_type from tbl_59_preferences;');
        res.status(200).send(users);

    },
    async dbModifyPref(req, res) {
        const { dbConnection } = require('../db_connection');
        const conn = await dbConnection.createConnection();

        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const destination = req.body.destination;
        const vaction_type = req.body.vaction_type;
        const access_code = req.body.access_code;

        if (calculateDayOffset(start_date, end_date) > 7) {
            res.status(400).send('length of date is more than a week, enter dates smaller than a week.');
            return;
        }

        try {
            conn.execute(`update tbl_59_preferences set start_date = ?, end_date = ?, destination = ?, vaction_type = ? where access_code = ? `,
                [start_date, end_date, destination, vaction_type, access_code]);
            res.status(200).send('Update preferences successfuly.');
        } catch (err) {
            res.status(404).send(`access_code: ${access_code} not found or invalid arguments to parameters. Error: ${err}`);
        }
    }


}

function calculateDayOffset(first_date, second_date) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const first = new Date(first_date);
    const second = new Date(second_date);

    const diffDays = Math.round(Math.abs((first - second) / oneDay));
    return diffDays;

}
