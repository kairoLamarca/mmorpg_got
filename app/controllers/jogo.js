module.exports.jogo = function (application, req, res) {

    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    let msg = '';
    if (req.query.msg != '') {//A = Erro
        msg = req.query.msg;
    }

    let usuario = req.session.usuario;
    let casa = req.session.casa;

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(res, usuario, casa, msg);


}

module.exports.sair = function (application, req, res) {
    req.session.destroy((err) => {//apaga toda a session
        res.render('index', { validacao: {} });
    });
}

module.exports.suditos = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    res.render('aldeoes');
}

module.exports.pergaminhos = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    /*recuperar as ações inseridas no banco de dados*/
    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    let usuario = req.session.usuario;

    JogoDAO.getAcoes(usuario, res);
}

module.exports.ordenar_acao_sudito = function (application, req, res) {
    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    let dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    let erros = req.validationErrors();

    if (erros) {
        res.redirect('jogo?msg=A');//A = erro
        return;
    }

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B'); // B = sucesso
}

module.exports.revogar_acao = function (application, req, res) {
    let url_query = req.query;

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    let _id = url_query.id_acao;

    JogoDAO.revogarAcao(_id, res);
};