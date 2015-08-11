var express = require('express');
var router = express.Router();
var quizController = require ('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');//Modulo 9
var quizAutor = require('../controllers/author_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});
router.param('quizId', quizController.load);
// Definición de rutas de sesión
router.get('/login',  sessionController.new); //formulario de login
router.post('/login', sessionController.create); //crear sesión
router.get('/logout', sessionController.destroy); //destruir sesión 
/*router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);*/
router.get('/quizes',     quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer); 
//Modulo 9 
router.get('/quizes/new', sessionController.loginRequired, quizController.new); //solicitar formulario para proponer nueva pregunta // LOGINREQUIRED M9Quiz17
router.post('/quizes/create', sessionController.loginRequired, quizController.create); //para crear nueva pregunta en la BD // LOGINREQUIRED M9Quiz17
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);  //solicitar formulario para editar una pregunta existente // LOGINREQUIRED M9Quiz17
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);  //actualizar la pregunta editada // LOGINREQUIRED M9Quiz17
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);  //Borrar o eliminar la pregunta editada // LOGINREQUIRED M9Quiz17
//Modulo 9  fin
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

router.get('/quizes/new', quizController.new);
router.post('/quizes/create',quizController.create);

//Mod 9 Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments'   , commentController.create);



router.get('/author', quizAutor.creditos);
// router.get('/author', function(req, res) {
//   res.render('author', { title: 'Quiz', errors: [] });
// });


module.exports = router;
