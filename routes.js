const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.schema;
const createHash = require('createHash');
const hashLen = 8; // 8 Chars long
const baseUrl = process.env.BASE_URL || 'http://localhost';

const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  createdAt: Date
});

const Redir = mongoose.model('Redir', redirSchema);

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply.file('views/index.html');
    }
  },
  {
    method: 'GET',
    path: '/public/{file}',
    handler(request, reply) {
      reply.file(`public/${request.params.file}`);
    }
  },
  {
    method: 'POST',
    path: '/new',
    handler(request, reply) {
      const uniqueID = createHash(hashLen);
      const newRedir = new Redir({
        shortUrl: `${baseUrl}/${uniqueID}`;
        url: request.payload.url,
        createdAt: new Date()
      });

      newRedir.save(function(err, redir) {
        reply(err ? err : redir);
      });
    },
    config: {
      validate: {
        payload: {
          url: Joi.string()
            .regex(/^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
            .required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/{hash}',
    handler(request, reply) {
      const query = {
        shortUrl: `${baseUrl}/${request.params.hash}`
      };

      Redir.findOne(query, function(err, redir) {
        if (err) {
          return reply(err);
        } else if (redir) {
          reply().redirect(redir.url);
        } else {
          reply.file('views/404.html').code(404);
        }
      });
    }
  }
];
