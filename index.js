const mongoose = require('mongoose');
const fastify = require('fastify')();
const jwt = require('fastify-jwt');
const Comment = require('./models/Comment');
const User = require('./models/User');

const PORT = process.env.port || 3000;

fastify
    .register(jwt, { secret: 'bratenko' })
    .get('/comments', async (req, reply) => {
        const comments = await Comment.find({})
        reply.send({ comments })
    })
    .route({
        method: 'GET',
        url: '/',
        schema: {
          querystring: {
            name: { type: 'string' },
            excitement: { type: 'integer' }
          },
          response: {
            200: {
              type: 'object',
              properties: {
                hello: { type: 'string' }
              }
            }
          }
        },
        handler: function (request, reply) {
          reply.send( "Comments api" )
        }
      })
    .post('/write', async (req, reply) => {
        const token = fastify.jwt.sign({ user: req.body.username })
        const comment = new Comment({
            text: req.body.text,
            name: req.body.name,
            surname: req.body.surname
        })
        await comment.save()
        reply.send({ token })
    })
    .post('/register', async (req, reply) => {
        const token = fastify.jwt.sign({ user: req.body.username })
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: req.body.password,
            token
        })
        await user.save()
        reply.send({ token })
    })
    .route({
        method: 'POST',
        url: '/login',
        handler: async (req, reply) => {
            await User.findOne({
                username: req.body.username,
                password: req.body.password
            }, (err, data) => {
                if (!data) {
                    reply.code(401);
                    return
                } else {
                    console.log('here we go...');
                }
                const user = data.name;
                const token = fastify.jwt.sign({ user });
                reply.send({    
                    name: data.name,
                    surname: data.surname,
                    username: data.username,
                    token 
                })
            })
        }
    })

async function startServer() {
    try {
        await mongoose.connect('mongodb+srv://admin:qwe123@cluster0-5avib.mongodb.net/comments', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        fastify.listen(PORT, (err, addr) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Server has been started on port ${PORT}`);
                console.log(`Comments api launched succesful!`);
            }
        });
    } catch (e) {
        console.log(e)
    }
}

startServer()