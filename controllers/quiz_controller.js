
var models= require('../models/models.js');

//Código válido para despliegue en Heroku con BBDD
//Get /quizes/question 
/*exports.question = function (req,res){
	//res.render('quizes/question',{pregunta:'Capital de Italia'});
	models.Quiz.findAll().success(
		function(quiz) {
			res.render('quizes/question', {pregunta: quiz[0].pregunta});
		}	
	)
};
*/



//Autoload 
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error) { next(error);});	
};




// exports.index= function(req, res){
// 	models.Quiz.findAll().then(function(quizes) {
// 		res.render('quizes/index', { quizes: quizes});
// 			}).catch(function(error) { next(error);})
// 	};
exports.index = function(req, res) {

    var querySql = {};
    var textoBusqueda = '';
    if( req.query.search === undefined ){
        querySql = {order: 'pregunta ASC'};
        textoBusqueda = 'Mostrando todas ...';
    } else {
        var search = '%' +  req.query.search.replace(/\s+/g,'%') + '%';
        querySql = {where:['pregunta like?', search], order:'pregunta ASC'};
        textoBusqueda = 'Filtrando por ' + req.query.search;

    }

    models.Quiz.findAll(querySql).then(
    //models.Quiz.findAll().then(
        function(quizes) {
            res.render('quizes/index', { quizes: quizes, busqueda: textoBusqueda});
        }
    ).catch(function(error) { next(error);})
};




exports.show = function(req, res){
	//models.Quiz.find(req.params.quizId).then(function(quiz){
	res.render('quizes/show', { quiz: req.quiz });
};




//Get /quizes/answer
exports.answer = function(req,res){

	
		models.Quiz.find(req.params.quizId).then(function (quiz){
			if (req.query.respuesta === req.quiz.respuesta){
				res.render('quizes/answer',{ quiz: req.quiz, respuesta: 'Correcto'});

			}else {
				res.render('quizes/answer',{ quiz: req.quiz, respuesta: 'Incorrecto'});
			}
		})
};

