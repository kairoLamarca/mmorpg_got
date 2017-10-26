module.exports.jogo = function (application, req, res) {

    if (req.session.autorizado !== true) {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
        return;
    }

    let comando_invalido = 'N';
    if(req.query.comando_invalido == 'S'){
        comando_invalido = 'S';
    }

    let usuario = req.session.usuario;
    let casa = req.session.casa;

    const connection = application.config.dbConnection;
    const JogoDAO = new application.app.models.JogoDAO(connection);

    JogoDAO.iniciaJogo(res, usuario, casa, comando_invalido);

    
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

    res.render('pergaminhos');
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

    if(erros){
        res.redirect('jogo?comando_invalido=S');
        return;
    }

    res.send('ok');
}