const { Pool } = require('pg');
const { connection } = require('./config');

const pool = new Pool(connection);

pool.connect((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log('problems connecting db', err);
  } else {
    // eslint-disable-next-line no-console
    console.log('connected to db');
  }
});

// ------------------------------GET ALLS
const getAllQuestions = (callback) => {
  const queryStr = 'SELECT * FROM questions LIMIT 1000';
  pool.query(queryStr, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      console.table(results.rows);
    }
  });
};

const getAllAnswers = (callback) => {
  const queryStr = 'SELECT * FROM answers LIMIT 1000';
  pool.query(queryStr, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      console.table(results.rows);
    }
  });
};

const getAllPhotos = (callback) => {
  const queryStr = 'SELECT * FROM photos LIMIT 1000';
  pool.query(queryStr, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      console.table(results.rows);
    }
  });
};

const getPhotos = (answerId, callback) => {
  const queryStr = 'SELECT * FROM photos limit 1000';
  pool.query(queryStr, [answerId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      console.table(results.rows);
    }
  });
};

const getQuestions = (prodId, callback) => {
  const queryStr = `SELECT
  questions.id,
  questions.product_id,
  questions.body,
  questions.date,
  questions.asker_name,
  questions.email,
  questions.reported,
  questions.helpfulness
  From questions
  WHERE product_id = $1 AND questions.reported = false
  GROUP BY questions.id`;

  const queryStr2 = `SELECT
    answers.id,
    answers.question_id,
    answers.body,
    answers.date,
    answers.answer_name,
    answers.email,
    answers.reported,
    answers.helpfulness,
    COALESCE (jsonb_agg(json_build_object(
    'id', photos.id,
    'answer_id', photos.answer_id,
    'url', photos.url))
    FILTER (WHERE photos.id IS NOT NULL),
    '[]') AS photos
  FROM answers
  LEFT JOIN photos ON photos.answer_id = answers.id
  WHERE question_id = $1 AND answers.reported = false
  GROUP BY answers.id`;
  let finalArr;
  pool.query(queryStr, [prodId])
    .then((res) => {
      finalArr = res.rows;
      for (let i = 0; i < res.rows.length; i += 1) {
        const inc = i;
        pool.query(queryStr2, [res.rows[i].id])
          .then((res2) => {
            for (let j = 0; j < res2.rows.length; j += 1) {
              finalArr[inc].answers = res2.rows[j];
            }
            finalArr[inc].answers = res2.rows;
          })
          .then(() => {
            if (inc === res.rows.length -1) {
              callback(finalArr);
            }
          });
      }

      // pool.query(queryStr2, [res.rows.id], (err, results) => {
      // if (err) {
      //   callback(err, null);
      //   console.error(err);
      // } else {
      //   callback(null, results.rows);
      //   console.table(results.rows);
      // }
      // });
    });
};

const getAnswers = (questionId, callback) => {
  const queryStr = `SELECT
   answers.id,
   answers.question_id,
   answers.body,
   answers.date,
   answers.answer_name,
   answers.email,
   answers.reported,
   answers.helpfulness,
   COALESCE (jsonb_agg(json_build_object(
    'id', photos.id,
    'answer_id', photos.answer_id,
    'url', photos.url))
    FILTER (WHERE photos.id IS NOT NULL),
    '[]') AS photos
  FROM answers
  LEFT JOIN photos ON photos.answer_id = answers.id
  WHERE question_id = $1 AND answers.reported = false
  GROUP BY answers.id`;
  pool.query(queryStr, [questionId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      //console.table(results.rows);
    }
  });
};

// -----------------------POST REQUESTS--------------------
const postQuestion = (qBody, callback) => {
  const queryStr = 'INSERT INTO questions (product_id, body, date, asker_name, email, reported, helpfulness) VALUES ($1, $2, NOW(), $3, $4, $5, $6)';
  pool.query(queryStr,
    [qBody.product_id,
      qBody.body,
      qBody.asker_name,
      qBody.email,
      qBody.reported,
      qBody.helpfulness],
    (err, results) => {
      if (err) {
        callback(err, null);
        // eslint-disable-next-line no-console
        console.error(err);
      } else {
        callback(null, results.rows);
        // eslint-disable-next-line no-console
        console.table(results.rows);
      }
    });
};

const postAnswer = (aBody, callback) => {
  const queryStr = 'INSERT INTO answers (question_id, body, date, answer_name, email, reported, helpfulness) VALUES ($1, $2, NOW(), $3, $4, $5, $6)';
  pool.query(queryStr,
    [aBody.question_id,
      aBody.body,
      aBody.answer_name,
      aBody.email,
      aBody.reported,
      aBody.helpfulness],
    (err, results) => {
      if (err) {
        callback(err, null);
        // eslint-disable-next-line no-console
        console.error(err);
      } else {
        callback(null, results.rows);
        // eslint-disable-next-line no-console
        console.table(results.rows);
      }
    });
};

const postPhoto = (pBody, callback) => {
  const queryStr = 'INSERT INTO photos (answer_id, url) VALUES ($1, $2)';
  pool.query(queryStr, [pBody.answer_id, pBody.url], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results.rows);
      // eslint-disable-next-line no-console
      console.table(results.rows);
    }
  });
};

// ------------USES PUT REQUESTS----------------------
const updateQuestionHelp = (questionId, callback) => {
  const queryStr = 'UPDATE questions SET helpfulness = helpfulness + 1 WHERE id = $1';
  pool.query(queryStr, [questionId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results);
    }
  });
};

const updateQuestionReport = (questionId, callback) => {
  const queryStr = 'UPDATE questions SET reported = true WHERE id = $1';
  pool.query(queryStr, [questionId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results);
    }
  });
};

const updateAnswerHelp = (answerId, callback) => {
  const queryStr = 'UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1';
  pool.query(queryStr, [answerId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results);
    }
  });
};

const updateAnswerReport = (answerId, callback) => {
  const queryStr = 'UPDATE answers SET reported = true WHERE id = $1';
  pool.query(queryStr, [answerId], (err, results) => {
    if (err) {
      callback(err, null);
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllQuestions,
  getAllAnswers,
  getAllPhotos,
  getQuestions,
  getAnswers,
  getPhotos,
  postQuestion,
  postAnswer,
  postPhoto,
  updateQuestionHelp,
  updateQuestionReport,
  updateAnswerHelp,
  updateAnswerReport,
};
