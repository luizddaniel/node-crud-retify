const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'farsoft01',
      database : 'farsoft_capixaba'
    }
  });

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

// rotas REST

server.get('', restify.plugins.serverStatic({

        directory: './dist',
        file: 'index.html'

}))


server.get('/read', (req, res, next) => {
    
    knex('pessoa').then((dados) => {
        res.send(dados);
    }, next)
    
});

server.post('/create', (req, res, next) => {
    
    knex('pessoa')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);
        }, next)
    
});

server.get('/show/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('pessoa')
        .where('id', id)
        .first()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send(dados);
        }, next)
        
});

server.put('/update/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('pessoa')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
        
});

server.del('/delete/:id', (req, res, next) => {
    
    const { id } = req.params;

    knex('pessoa')
        .where('id', id)
        .delete()
        .then((dados) => {
            if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
        
});
