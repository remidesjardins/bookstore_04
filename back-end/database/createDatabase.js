const mysql = require('mysql2');
const dbconfig = require('connection');

const connection = mysql.createConnection(dbconfig);

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('USER', 'ADMIN') NOT NULL
    );
  `;

// Instruction SQL pour créer la table Books
const createBooksTable = `
    CREATE TABLE IF NOT EXISTS Books (
      book_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      cover_image VARCHAR(255),
      category ENUM('Science Fiction', 'Mystery & Thriller', 'Children\'s Books', 'Historical', 'Educational') NOT NULL,
      summary TEXT
    );
  `;

// Instruction SQL pour créer la table Favorites
const createFavoritesTable = `
    CREATE TABLE IF NOT EXISTS Favorites (
      favorite_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      book_id INT,
      FOREIGN KEY (user_id) REFERENCES Users(user_id),
      FOREIGN KEY (book_id) REFERENCES Books(book_id)
    );
  `;

// Créer les tables
connection.query(createUsersTable, (err, results) => {
    if (err) {
        console.error('Erreur lors de la création de la table Users :', err);
        return;
    }
    console.log('Table Users créée ou déjà existante.');
});

connection.query(createBooksTable, (err, results) => {
    if (err) {
        console.error('Erreur lors de la création de la table Books :', err);
        return;
    }
    console.log('Table Books créée ou déjà existante.');
});

connection.query(createFavoritesTable, (err, results) => {
    if (err) {
        console.error('Erreur lors de la création de la table Favorites :', err);
        return;
    }
    console.log('Table Favorites créée ou déjà existante.');
});

// Fermer la connexion une fois les tables créées
connection.end((err) => {
    if (err) {
        console.error('Erreur lors de la fermeture de la connexion :', err);
        return;
    }
    console.log('Connexion à la base de données MySQL fermée.');
});