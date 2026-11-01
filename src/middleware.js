const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Debe iniciar sesión' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Sesión inválida o vencida' });
  }
}

function permitirRoles(...roles) {
  return (req, res, next) => {
    if (roles.includes(req.usuario.rol)) return next();
    res.status(403).json({ error: 'No tiene permiso para esta acción' });
  };
}

module.exports = { verificarToken, permitirRoles };
