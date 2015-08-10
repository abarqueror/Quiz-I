
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
/*exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error) { next(error);});	
};*/
//Para modulo 9
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			} else {next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error){next(error);});
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
            res.render('quizes/index', { quizes: quizes, busqueda: textoBusqueda,errors:[]});
        }
    ).catch(function(error) { next(error);})
};




exports.show = function(req, res){
	//models.Quiz.find(req.params.quizId).then(function(quiz){
	res.render('quizes/show', { quiz: req.quiz, errors: []});
};




//Get /quizes/answer
exports.answer = function(req,res){

	
		models.Quiz.find(req.params.quizId).then(function (quiz){
			if (req.query.respuesta === req.quiz.respuesta){
				res.render('quizes/answer',{ quiz: req.quiz, respuesta: 'Correcto', errors: [] });

			}else {
				res.render('quizes/answer',{ quiz: req.quiz, respuesta: 'Incorrecto', errors: [] });
			}
		})
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build({pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'Otro'});
	res.render('quizes/new', {
		quiz: quiz, 
		errors: []
		}
	);
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', { quiz: quiz, errors: err.errors });
		}
		else{
			quiz
			.save(
				{fields: ["pregunta", "respuesta", "tema"]})
			.then(function(){
				res.redirect('/quizes')});
		}

	});
};



// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', {
		quiz: quiz, 
		errors: []
		}
	);
};

// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}
			else {
				req.quiz
				.save(
					{fields: ["pregunta", "respuesta", "tema"]})
				.then(function(){
					res.redirect('/quizes')});
			}
		}
	);

};

// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then( function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};