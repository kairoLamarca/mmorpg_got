module.exports.jogo = function (application, req, res) {

    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    let usuario = req.session.usuario;
    let casa = req.session.casa;

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(res, usuario, casa);

    
}

module.exports.sair = function (application, req, res) {

    req.session.destroy((err) => {//apaga toda a session
        res.render('index', { validacao: {} });
    });

}