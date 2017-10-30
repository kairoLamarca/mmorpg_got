/* importar o módulo do crypto*/
const crypto = require("crypto");

function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("usuarios", (err, collection) => {

            //tipo de criptografia | valor a ser criptografado | tipo de retorno
            let senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
            usuario.senha = senha_criptografada;
            collection.insert(usuario);

            mongoclient.close();
        })
    });
}

UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("usuarios", (err, collection) => {
            
            let senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
            usuario.senha = senha_criptografada;
            
            collection.find(usuario).toArray((err, result) => {//recupera o cursor retornado e converte em um array
                
                if(result[0] != undefined){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }
                else{
                    req.session.autorizado = false;
                }

                if(req.session.autorizado){
                    res.redirect('jogo');
                }
                else{
                    res.render('index', {validacao: [{msg:'Usuário inválido!'}], usuario: usuario});
                }

            });

            mongoclient.close();
        })
    });
}

module.exports = function () {
    return UsuariosDAO;
}

// //Ecmascript 6
// class UsuariosDAO{
//     constructor(connection){
//     }

//     inserirUsuario(usuario){
//         console.log(usuario);
//     };
// }