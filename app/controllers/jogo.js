module.exports.jogo = function (application, req, res) {

    if (req.session.autorizado) {
        res.render('jogo');
    }
    else {
        res.render('index', { validacao: [{ msg: 'É necessário efetuar o login primeiro!' }] });
    }

}

module.exports.sair = function (application, req, res) {

    req.session.destroy((err) => {//apaga toda a session
        res.render('index', {validacao: {}});
    });

}