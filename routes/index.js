var express = require('express');
var router = express.Router();
var moment = require('moment');


module.exports = (db) => {
  // Get All data (READ)
  router.get('/', function (req, res, next) {
    const { checkId, id, checkString, string, checkInteger, integer, checkFloat, float, checkBool, bool, checkDate, startDate, endDate } = req.query;
    let isSearch = false;
    let query = [];

    if (checkId && id) {
      query.push(`id = '${id}'`);
      isSearch = true;
    }
    if (checkString && string) {
      query.push(`stringdata =  '${string}'`);
      isSearch = true;
    }
    if (checkInteger && integer) {
      query.push(`integerdata = ${integer}`);
      isSearch = true;
    }
    if (checkFloat && float) {
      query.push(`floatdata = ${float}`);
      isSearch = true;
    }
    if (checkBool && bool) {
      query.push(`booleandata = '${bool}'`);
      isSearch = true;
    }

    if (checkDate && startDate && endDate) {
      query.push(` datedata = BETWEEN '${startDate}' AND '${endDate}'`);
      isSearch = true;
    }

    let search = "";
    if (isSearch) {
      search += `WHERE ${query.join(' AND ')}`;
    }

    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    db.query(`SELECT COUNT (id) as total FROM bread`, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      else if (data.rows == 0) {
        return res.send(`Data yang Anda Cari tidak ditemukan`);
      } else {
        total = data.rows[0].total;
        const pages = Math.ceil(total / limit);

        let sql = `SELECT * FROM bread ${search} LIMIT $1 OFFSET $2 `
        db.query(sql, [limit, offset], (err, data) => {
          if (err) {
            return res.send(err);
          } else if (data.rows == 0) {
            return res.send(`data can not be found`);
          }
          else {
            res.render('source', {
              data: data.rows,
              page,
              pages,
              moment
            });
          }
        });
      }
    });

  });

  // ADD New Data
  router.get('/add', function (req, res) {
    res.status(200).render('add')
  })

  router.post('/add', function (req, res) {
    db.query('INSERT INTO bread (stringdata, integerdata, floatdata, booleandata, datedata) VALUES  ($1,$2,$3,$4,$5)', [req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata], (err) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.status(201).json({
        error: false,
        message: 'data success to be added'
      });
    });
  });

  // Delete Data refers to it's id
  router.get('/delete/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    db.query(`DELETE FROM bread WHERE id = ${id}`, (err) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      })
      res.redirect('/');
    })
  })

  // Edit Data refers to it's id
  router.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    let sql = `SELECT * FROM bread WHERE id = ${id}`;
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json({
        error: true,
        message: 'data tidak dapat diakses'
      });
      const { id, stringdata, integerdata, floatdata, booleandata, datedata } = data.rows[0];
      const newDate = moment(datedata).format("YYYY-MM-DD");
      const edit = {
        id, stringdata, integerdata, floatdata, booleandata, newDate
      }
      res.render('edit', { row: edit });
    });
  });

  router.post('/edit/:id', function (req, res, next) {
    db.query('UPDATE bread SET stringdata = $2, integerdata = $3, floatdata = $4, booleandata = $5, datedata = $6  WHERE id = $1', [parseInt(req.params.id), req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata], (err) => {
      if (err) return res.status(500).json({
        error: true,
        message: err
      });
      res.status(201).json({});
    });
    // const data = [parseInt(req.params.id), req.body.stringdata, parseInt(req.body.integerdata), parseFloat(req.body.floatdata), JSON.parse(req.body.booleandata), req.body.datedata];
    res.redirect('/');
  });

  return router;
}



