function UsuariosDAO(connection) {
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("usuarios", (err, collection) => {
            collection.insert(usuario);

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