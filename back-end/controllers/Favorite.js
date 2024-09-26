const sql = require('mysql2/promise');
const dbconf = require('../database/connection');

exports.GetAllFavorites = async (req, res, next) => {

    try{

        const connection = await sql.createConnection(dbconf);
        const [result] = await connection.execute('SELECT * FROM favorites');
        await connection.end();
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error})
    }

}

exports.GetOneFavorite = async (req, res, next) => {

    const id = req.params.id;

    try{
        const connection = await sql.createConnection(dbconf);
        const [result] = await connection.execute('SELECT * FROM favorites WHERE favorite_id = ?',[id]);
        await connection.end();
        res.status(200).json(result);
    }catch (error){
        res.status(400).json({message:error});
    }

}

exports.CreateFavorite = async (req, res, next) => {

    const {user_id, book_id} = req.body;

    if(!user_id || !book_id){
        res.status(400).json({message:'missing information'})
    }

    try {
        const connection = await sql.createConnection(dbconf);
        const [result] = await connection.execute('INSERT INTO favorites (user_id, book_id) VALUES (? , ?)', [user_id, book_id]);
        await connection.end();
        res.status(200).json(result);
    }catch (error){
        res.status(400).json({message:error});
    }

}

exports.UpdateFavorite = async (req, res, next) => {
    const id = req.params.id;
    const { user_id, book_id } = req.body;

    if(!user_id || !book_id){
        res.status(400).json({message:'missing information'})
    }

    try {
        const connection = await sql.createConnection(dbconf);
        const [result] = await connection.execute('UPDATE favorites SET user_id = ?, book_id = ? WHERE favorite_id = ?',[user_id, book_id, id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.status(200).json(result);
    }catch (error){
        res.status(400).json({message:error});
    }




}
exports.DeleteFavorite = async (req, res, next) => {

    const id = req.params.id;

    try {

        const connection = await sql.createConnection(dbconf)
        const [result] = await connection.execute('DELETE FROM favorites WHERE favorite_id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.status(200).send('Utilisateur supprimé');

    }catch (err){
        res.status(400).send({error: err});
    }


}