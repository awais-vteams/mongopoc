const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = 'mongodb://poc:meanstack@bdshop-shard-00-00-4amab.mongodb.net:27017,bdshop-shard-00-01-4amab.mongodb.net:27017,bdshop-shard-00-02-4amab.mongodb.net:27017/jData?ssl=true&replicaSet=BDSHOP-shard-0&authSource=admin';
//const uri = 'mongodb://localhost:27017/mean';

// Connect
const connection = (closure) => {
  return MongoClient.connect(uri, (err, db) => {
    if (err) console.log(err.message);

    closure(db);
  });
};

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

let makeQuery = (obj, from, to, query, isInt) => {

  if (from != '') {
    query[obj]['$gte'] = (isInt) ? parseInt(from) : parseFloat(from);
  }

  if (to != '') {
    query[obj]['$lte'] = (isInt) ? parseInt(to) : parseFloat(to);
  }

  if (query[obj]['$gte'] == '') delete query[obj]['$gte'];
  if (query[obj]['$lte'] == '') delete query[obj]['$lte'];

  return query;
};


router.get('/count', (req, res) => {
  let params = JSON.parse(req.query.data);
  let query = {};

  if (params != undefined) {
    query = {
      co_country: {$in: []},
      co_sic: {$in: []},
      co_state: {$in: []},
      co_countemployee: {$gte: '', $lte: ''},
      co_turnover: {$gte: '', $lte: ''},
      co_foudate: {$gte: '', $lte: ''},
    };

    for (let i = 0; i < params.countries.length; i++) {
      if (params.countries[i].country !== '') {
        query.co_country.$in.push(params.countries[i].country);
      }
    }

    for (let i = 0; i < params.sic.length; i++) {
      if (params.sic[i].sic !== '') {
        query.co_sic.$in.push(parseInt(params.sic[i].sic));
      }
    }

    for (let i = 0; i < params.state.length; i++) {
      if (params.state[i].state !== '') {
        query.co_state.$in.push(params.state[i].state);
      }
    }

    query = makeQuery('co_countemployee', params.employeeFrom, params.employeeTo, query, true);
    query = makeQuery('co_turnover', params.turnoverFrom, params.turnoverTo, query, false);
    query = makeQuery('co_foudate', params.foudateFrom, params.foudateTo, query, true);

    if (!query.co_country.$in.length) delete query.co_country;
    if (!query.co_sic.$in.length) delete query.co_sic;
    if (!query.co_state.$in.length) delete query.co_state;
    if (Object.keys(query.co_countemployee).length === 0) delete query.co_countemployee;
    if (Object.keys(query.co_turnover).length === 0) delete query.co_turnover;
    if (Object.keys(query.co_foudate).length === 0) delete query.co_foudate;
  }

  console.log(query);

  connection((db) => {
    db.collection('company')
      .find(query)
      //.count()
      .explain("executionStats")
      .then((stats) => {
        response.data = {
          count: stats.executionStats.nReturned,
          time: stats.executionStats.executionTimeMillis
        };
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  })
});

router.get('/states', (req, res) => {
  connection((db) => {
    db.collection('states')
      .aggregate([
        {
          "$project": {
            _id: 0,
            "name": "$_id"
          }
        }
      ])
      .toArray()
      .then((states) => {
        response.data = states;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  })
});

router.get('/company', (req, res) => {
  connection((db) => {
    db.collection('company')
      .find()
      .limit(5)
      .toArray()
      .then((states) => {
        response.data = states;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  })
});

module.exports = router;
