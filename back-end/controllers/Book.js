const sql = require('mysql2/promise');
const dbconf = require('../database/connection');

exports.GetAllBook = async (req, res, next) => {

    try {
        const connection = await sql.createConnection(dbconf);
        const [row] = await connection.execute('SELECT * FROM books');
        await connection.end();
        res.status(200).json(row);
    }catch (err){
        res.status(500).send({})
    }

}

exports.GetOneBook = async (req, res, next) => {
    const id = req.params.id;

    try {

        const connection = await sql.createConnection(dbconf)
        const [row] = await connection.execute('SELECT * FROM books WHERE book_id = ?', [id]);
        await connection.end();
        res.status(200).json(row);

    }catch (err){
        res.status(400).send({error: err});
    }


}

exports.CreateBook = async (req, res, next) => {
    const { title, author, cover_image, category, summary } = req.body;



    if(!title || !author || !cover_image || !category || !summary){
        res.status(400).json({message:"missing information"});
    }else{
        try {
            const connection = await sql.createConnection(dbconf);
            const [result] = await connection.execute(
                'INSERT INTO books (title, author, cover_image, category, summary) VALUES( ?, ?, ?, ?, ?)',
                [title, author, cover_image, category, summary]
            )

            await connection.end();
            res.status(200).json(result);
        }catch (error){
            res.status(400).json({message:error});
        }



    }


}

exports.UpdateBook = async (req, res, next) => {

    const id = req.params.id;
    const { title, author, cover_image, category, summary } = req.body;



    if(!title || !author || !cover_image || !category || !summary){
        res.status(400).json({message:"missing information"});
    }else{
        try {
            const connection = await sql.createConnection(dbconf);
            const [result] = await connection.execute(
                'UPDATE books SET title = ?, author = ?, cover_image = ?, category = ?, summary = ? WHERE book_id = ?',
                [title, author, cover_image, category, summary, id]
            );

            await connection.end();
            if (result.affectedRows === 0) {
                return res.status(404).send('Utilisateur non trouvé');
            }
            res.status(200).json(result);
        }catch (error){
            res.status(400).json({message:error});
        }



    }

}
exports.DeleteBook = async (req, res, next) => {
    const id = req.params.id;

    try {

        const connection = await sql.createConnection(dbconf)
        const [result] = await connection.execute('DELETE FROM books WHERE book_id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.status(200).send('Utilisateur supprimé');

    }catch (err){
        res.status(400).send({error: err});
    }
}