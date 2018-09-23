var crypto = require('crypto');
var sqlite3 = require('sqlite3');


//rota de usuarios
exports.users = function( req , res ){
    var db = new sqlite3.Database(__dirname+'/../gerenciaclinica.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });


    db.all('SELECT * FROM Users ',[],(err,rows)=>{
      if (err) {
          throw err;
      }
      res.json(rows);
    });


    db.close();

};
exports.register = function( req , res ){
    var db = new sqlite3.Database(__dirname+'/../gerenciaclinica.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    db.run('INSERT INTO USERS(NOME,EMAIL,PASSWORD,cpf,salt) VALUES(?,?,?,?,?)',[
            req.headers.name,
            req.headers.username,
            hashPassword(req.headers.password,'teste-2467196sfg9387%%#@'),
            req.headers.cpf,
            'teste-2467196sfg9387%%#@'],
        function(obs){
            res.json(obs);
            console.log(obs);
    });
    db.close();

};



function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}
