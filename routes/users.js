var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports = (db) => {
  router.get('/', function (req, res, next) {
    db.query('select * from bread', (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.json(data.rows);
    });
  });

  router.post('/', function (req, res, next) {
    db.query('INSERT INTO bread (stringdata, integerdata, floatdata, booleandata, datedata) VALUES  ($1,$2,$3,$4,$5)', [req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata], (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'data berhasil ditambahkan'
      })
    });
  });

  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM bread WHERE id = $1', [parseInt(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'data berhasil di hapus'
      });
    })
  })

  router.put('/:id', function (req, res, next) {
    db.query('UPDATE bread SET stringdata = $2, integerdata = $3, floatdata = $4, booleandata = $5, datedata = $6  WHERE id = $1', [parseInt(req.params.id), req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata], (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'data berhasil di ganti'
      });
    })
  })

  return router;
}
