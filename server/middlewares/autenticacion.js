const jwt = require('jsonwebtoken');

//===================
//Verificar token
//===================
//req: solicitud que hago, res: respuesta que deseo retornar, next: continuar con la ejecución del programa
let verificaToken = (req, res, next) => {
    //lectura de headers
    let token = req.get('token'); //Authorization
    //console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //si sale algo mal, es decir, si hay error, por ejemplo, si el token expiró
        //esta información quedaría almacenada en el err
        //de lo contrario tenemos la respuesta en decoded
        if (err) {
            return res.status(401).json({
                ok: false,
                err
                // err: {
                //     message: 'Token no válido'
                // }
            });
        }

        //decoded es todo el payload, lo pasamos al request, para saber qué usuario está autenticándose
        req.usuario = decoded.usuario;
        //console.log('pruega');
        next();

    });
    // res.json({
    //     token: token
    // });
};


//===================
//Verificar admin rol
//===================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    //console.log(req.usuario);
    // if (err) {
    //     return res.status(401).json({
    //         ok: false,
    //         err: {
    //             message: 'El usuario no es administrador'
    //         }
    //     });
    // }

    if (!(usuario.role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tiene permisos para realizar la acción'
            }
        });
    }

    next();

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}