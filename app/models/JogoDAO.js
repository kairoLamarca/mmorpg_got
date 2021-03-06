const ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection) {
    this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function (usuario) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("jogo", (err, collection) => {
            collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            });

            mongoclient.close();
        })
    });
}

JogoDAO.prototype.iniciaJogo = function (res, usuario, casa, msg) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("jogo", (err, collection) => {
            collection.find({ usuario: usuario }).toArray((err, result) => {//recupera o cursor retornado e converte em um array

                res.render('jogo', { img_casa: casa, jogo: result[0], msg: msg });

                mongoclient.close();
            });
        })
    });
}

JogoDAO.prototype.acao = function (acao) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("acao", (err, collection) => {

            let date = new Date();

            let tempo = null;

            switch (parseInt(acao.acao)) {
                case 1: tempo = 1 * 60 * 60000; break;
                case 2: tempo = 2 * 60 * 60000; break;
                case 3: tempo = 5 * 60 * 60000; break;
                case 4: tempo = 5 * 60 * 60000; break;
            }

            acao.acao_termina_em = date.getTime() + tempo;
            collection.insert(acao);
        });

        mongoclient.collection("jogo", (err, collection) => {

            let moedas = null;

            switch (parseInt(acao.acao)) {
                case 1: moedas = -2 * acao.quantidade; break;
                case 2: moedas = -3 * acao.quantidade; break;
                case 3: moedas = -1 * acao.quantidade; break;
                case 4: moedas = -1 * acao.quantidade; break;
            }

            collection.update(
                { usuario: acao.usuario },
                { $inc: { moeda: moedas } }//chave faz um incremento do valor no banco com o valor passado
            )

            mongoclient.close();
        });
    });
}

JogoDAO.prototype.getAcoes = function (usuario, res) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("acao", (err, collection) => {

            let date = new Date();
            let momento_atual = date.getTime();

            collection.find({ usuario: usuario, acao_termina_em: { $gt: momento_atual } }).toArray((err, result) => {//recupera o cursor retornado e converte em um array

                res.render('pergaminhos', { acoes: result });

                mongoclient.close();
            });
        });
    });
};

JogoDAO.prototype.revogarAcao = function (_id, res) {
    this._connection.open((err, mongoclient) => {
        mongoclient.collection("acao", (err, collection) => {

            collection.remove(
                { _id: ObjectID(_id) },
                function(err, result){
                    res.redirect("jogo?msg=D")
                    mongoclient.close();
                }
            );
        });
    });
};

module.exports = function () {
    return JogoDAO;
}