const sql = require('mysql2/promise');
const dbconf = require('../database/connection');
const bcrypt = require('bcrypt');


exports.GetAllUser = async (req, res, next) => {

    try {

        const connection = await sql.createConnection(dbconf)
        const [row] = await connection.execute('SELECT * FROM users');
        await connection.end();
        res.status(200).json(row);

    }catch (err){
        console.log(err)
        res.status(400).send({err});
    }

}

exports.GetOneUser = async (req, res, next) => {

    const id = req.params.id;

    try {

        const connection = await sql.createConnection(dbconf)
        const [row] = await connection.execute('SELECT * FROM Users WHERE user_id = ?', [id]);
        await connection.end();
        res.status(200).json(row);

    }catch (err){
        res.status(400).send({error: err});
    }



}

exports.CreateUser = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;



    const hashPassword = bcrypt.hashSync(password, 10);
    if(!username || !email || !password || !role){
        res.status(400).json({message:"missing information"});
    }else{
        try {
            const connection = await sql.createConnection(dbconf);
            const [result] = await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES( ?, ?, ?, ?)',
                [username, email, hashPassword, role]
            )

            await connection.end();
            res.status(200).json(result);
        }catch (error){
            res.status(400).json({message:error});
        }



    }


}

exports.UpdateUser = async (req, res, next) => {

    const id = req.params.id;
    const {email, password , username, role} = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }else{

        try {

            const connection = await sql.createConnection(dbconf)
            const [result] = await connection.execute(
                'UPDATE Users SET username = ?, email = ?, password = ?, role = ? WHERE user_id = ?',
                [username, email, password, role, id]
            );
            await connection.end();
            if (result.affectedRows === 0) {
                return res.status(404).send('Utilisateur non trouvé');
            }

            res.status(200).send('Utilisateur mis à jour');

        }catch (err){
            res.status(400).send({error: err});
        }


    }



}
exports.DeleteUser = async (req, res, next) => {

    const id = req.params.id;

    try {

        const connection = await sql.createConnection(dbconf)
        const [result] = await connection.execute('DELETE FROM Users WHERE user_id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.status(200).send('Utilisateur supprimé');

    }catch (err){
        res.status(400).send({error: err});
    }


}