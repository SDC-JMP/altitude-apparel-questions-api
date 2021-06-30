const express = require('express');

const router = express.Router();
const pool = require('../database/pool');

// -------------------------------GET ALLS-------------------------
router.get('/questions', (req, res) => {
  pool.getAllQuestions((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.get('/answers', (req, res) => {
  pool.getAllAnswers((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.get('/photos', (req, res) => {
  pool.getAllPhotos((err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

// -----------------------------GET WITH ID---------------------------
router.get('/questions/:prodID', (req, res) => {
  pool.getQuestions(req.params.prodID, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.get('/answers/:questionID', (req, res) => {
  pool.getAnswers(req.params.questionID, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

router.get('/photos/:answerID', (req, res) => {
  pool.getPhotos(req.params.answerID, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

// -------------------------------POSTS-------------------------
router.post('/questions', async (req, res) => {
  try {
    // console.log('REQBODY', req.body);
    await pool.postQuestion(req.body, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('questions post was not successful', err);
      } else {
        res.send(results.rows);
        // eslint-disable-next-line no-console
        console.log('questions post was successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('questions post was not successful', err);
  }
});

router.post('/answers', async (req, res) => {
  try {
    // console.log('REQBODY', req.body);
    await pool.postAnswer(req.body, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('answers post was not successful', err);
      } else {
        res.send(results.rows);
        // eslint-disable-next-line no-console
        console.log('post success', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('answers post was not successful', err);
  }
});

router.post('/photos', async (req, res) => {
  try {
    // console.log('REQBODY', req.body);
    await pool.postPhoto(req.body, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('photos post was not successful', err);
      } else {
        res.send(results.rows);
        // eslint-disable-next-line no-console
        console.log('Photos post successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('Photos post was not successful', err);
  }
});

// -----------------------------------PUTS----------------------
router.put('/questions/:questionID/helpful', async (req, res) => {
  try {
    // console.log('REQBODY', req.params);
    await pool.updateQuestionHelp(req.params.questionID, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('questions helpful was not successful', err);
      } else {
        res.send(results);
        // eslint-disable-next-line no-console
        console.log('questions helpful successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('questions helpful was not successful', err);
  }
});

router.put('/questions/:questionID/report', async (req, res) => {
  try {
    // console.log('REQBODY', req.params);
    await pool.updateQuestionReport(req.params.questionID, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('question report was not successful', err);
      } else {
        res.send(results);
        // eslint-disable-next-line no-console
        console.log('question report successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('question report was not successful', err);
  }
});

router.put('/answers/:questionID/helpful', async (req, res) => {
  try {
    // console.log('REQBODY', req.params);
    await pool.updateAnswerHelp(req.params.questionID, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('answers helpfulwas not successful', err);
      } else {
        res.send(results);
        // eslint-disable-next-line no-console
        console.log('answers helpful successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('answers helpful was not successful', err);
  }
});

router.put('/answers/:answerID/report', async (req, res) => {
  try {
    // console.log('REQBODY', req.params);
    await pool.updateAnswerReport(req.params.answerID, (err, results) => {
      if (err) {
        res.send(err.message);
        // eslint-disable-next-line no-console
        console.log('answers report was not successful', err);
      } else {
        res.send(results);
        // eslint-disable-next-line no-console
        console.log('answers report successful', results);
      }
    });
  } catch (err) {
    res.send(err);
    // eslint-disable-next-line no-console
    console.log('answers report was not successful', err);
  }
});

module.exports = router;
