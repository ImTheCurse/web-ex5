const { v4 } = require('uuid');
const uuid = v4;

//all of these are potential for sql injection, but we learend it in class so I digress.
exports.prefController = {

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

    }







}


