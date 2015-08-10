var path = require('path');
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


var Sequelize = require('sequelize');
//var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);


// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

var comment_path = path.join(__dirname, 'comment');
//Importar la definicion de la tabla Comment de comment.js
var Comment = sequelize.import(comment_path);

//Relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


// exportar la definición de la tabla Quiz
exports.Quiz = Quiz; 

exports.Comment = Comment; //exportar definicion de tabla Comment

// sequelize.sync() crea e inicializa la tabla de preguntas en la BBDD
sequelize.sync().then(function() {
		//console.log('inicio sync'); // control de paso de programa
		Quiz.count().then( //success(...) ejecuta el manejador una vez creada la tabla
			function (count) {
				if (count===0) {
					console.log('La tabla Quiz esta vacía. Se procede a llenarla con la pregunta inicial'); // control de paso de programa
					Quiz.create({
			   			pregunta: 'Capital de Italia',
						respuesta: 'Roma',
						tema: 'otro'
			});
					Quiz.create({
						pregunta: 'Capital de Portugal',
						respuesta: 'Lisboa',
						tema: 'otro'
			})

					.then(						function(){console.log('Base de datos inicializada con dos preguntas')}
					);
				} else {
					console.log('La tabla Quiz tiene datos. No se modifica.'); // control de paso de programa
				};
			}
		);
	}
);