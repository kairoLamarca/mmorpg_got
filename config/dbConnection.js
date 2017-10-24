/* importar o mongodb */
let mongo = require('mongodb');

let connMongoDB = function(){
    //banco de dados / conexão servidor  / configurações
    let db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost', //string contendo o endereço do servidor
            27017, //porta de conexão
            {}//objeto com configuraçãoes do servidor
        ),
        {}//objeto de configurções opcionais
    );

    return db;
};

module.exports = function(){
    return connMongoDB;//retorna uma variavel ao invés da função direto, para que só execute quando abrir a função e não quando referenciar o arquivo
}