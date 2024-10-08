const jwt = require('jsonwebtoken')

exports.Auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'TOKEN');
        const userId = decoded.userId;
        const role = decoded.roles;

        req.auth = {
            userId: userId,
            role: role,
        };

        next();
    }catch (error){
        res.status(401).send({error})
    }
}


exports.admin = (req, res, next) => {
    if (req.auth.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès interdit : Admin requis' });
    }
    next(); // If the user is admin, we pass to the next middleware
};

// Middleware pour les routes utilisateur
exports.user = (req, res, next) => {
    if (req.auth.role !== 'USER' && req.auth.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Accès interdit : Utilisateur requis' });
    }
    next(); // If the user is admin or user, we pass to the next middleware
};
