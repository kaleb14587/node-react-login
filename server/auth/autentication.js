var crypto = require('crypto');
var sqlite = require('sqlite-sync'); //requiring
//Connecting - if the file does not exist it will be created
sqlite.connect(__dirname+'/../gerenciaclinica.db');

//define a validade do token de acesso em dias
let validade_do_token = 10;
//gera um hash com o salt predefinido
function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}
// "middleware" valida o token de acesso no header
exports.is_authorized = function(req,res,next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization;
        var token_db = sqlite.run("SELECT * FROM token_access where token=?", [token]);
        if (token_db.length > 0) {
            var row = token_db[0];
            if (!req.session) {
                console.log("sessao nao iniciada");
                sqlite.run('DELETE * FROM token_access where token=?', [token]);
                res.status(400).send({
                    message: "sessao expirada"
                });
            }

            var now = new Date();

            if ((now - parseInt(row.created_at)) > 865208904) {
                res.status(400).send({
                    message: "validade do token expirada"
                });
            } else next();

        } else {
            res.status(400).send({
                message: "não autorizado"
            });
        }
    }
};
exports.authentication= function(req ,res ,next){
    if(req.body){
        if(!req.body.username){
            res.status(400).send({
                message: 'username é obrigatorio'
            });
        }
        if(!req.body.password){
            res.status(400).send({
                message: 'password é obrigatorio'
            });
        }
        if(req.body.password && req.body.username)
        {
            authentication(req.body.username,req.body.password,
                (message,user)=>{
                if(user){
                    req.session.user_id         = user.id;
                    req.session.email           = user.email;
                    req.session.cookie          = {};
                    req.session.cookie.maxAge   = (86400*10) ;
                }
                res.send(message);
            });
        }
    }else{
        res.status(301).send({message:'nenhum parametro encontrado'});
    }
};

function authentication(username, password ,callback){
    var row = sqlite.run('SELECT salt,email FROM Users WHERE email = ?', [username]);
    console.log(row);
    if(row.length < 1){
        return callback({message:"nome de usuario incorreto"});
    }else {
        var user = row[0];

        var hash = hashPassword(password, user.salt);
        var senha = sqlite.run('SELECT * FROM Users WHERE email = ? AND password = ?', [user.email, hash]);
        var validaSenha = senha[0];
        if (!validaSenha) return callback({message:"senha incorreta"});
        else generatedTokenFromAccess(validaSenha,callback);
    }

}

function  generatedTokenFromAccess(row,callback){
    var retorno ={};
    var data = Date.now();
    var token =hashPassword(row.nome,data+"");

    var id = sqlite.insert(" token_access ",
            {
                id_user:row.id,
                token:token,
                created_at:(data+""),
                validade:(validade_do_token+"")
            }
        );
    console.log(id);
    if(!id){
        retorno.message =  "nao foi possivel criar um token";
        callback(retorno);
    }else{
        retorno.access_token  =  token;
        callback(retorno,row);
    }

}
