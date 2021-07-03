DROP DATABASE IF EXISTS questions_db;
CREATE DATABASE questions_db;

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id BIGSERIAL NOT NULL,
  product_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  asker_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpfulness INT,
  PRIMARY KEY (id)
);
COPY questions (id, product_id, body, date, asker_name, email, reported, helpfulness)
FROM '/home/mhhutton/HR_CO1712/SDC/altitude-apparel-questions-api/csvFiles/questions.csv'
DELIMITER ','
CSV HEADER;

ALTER TABLE questions ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL;
SELECT setval('questions_id_seq',(SELECT max(id) FROM questions));
CREATE questions_id_idx on questions(product_id);

CREATE TABLE answers (
  id BIGSERIAL NOT NULL,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  answer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpfulness INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT questions_fkey FOREIGN KEY (question_id) REFERENCES questions (id)
);
COPY answers (id, question_id, body, date, answer_name, email, reported, helpfulness)
FROM '/home/mhhutton/HR_CO1712/SDC/altitude-apparel-questions-api/csvFiles/answers.csv'
DELIMITER ','
CSV HEADER;
CREATE INDEX answers_id_idx on answers(question_id);

ALTER TABLE answers ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL;
SELECT setval('answers_id_seq',(SELECT max(id) FROM answers));
CREATE INDEX answers_id_idx on questions(product_id);

CREATE TABLE photos (
  id BIGSERIAL NOT NULL,
  answer_id INT NOT NULL,
  url VARCHAR(65000),
  PRIMARY KEY (id),
  CONSTRAINT answers_fkey FOREIGN KEY (answer_id) REFERENCES answers (id)
);
COPY photos (id, answer_id, url)
FROM '/home/mhhutton/HR_CO1712/SDC/altitude-apparel-questions-api/csvFiles/answers_photos.csv'
DELIMITER ','
CSV HEADER;

SELECT setval('photos_id_seq',(SELECT max(id) FROM photos));
CREATE INDEX photos_id_idx on photos(answer_id);

-- Execute this file from the command line by typing: psql -U postgres -h 127.0.0.1 -f ./schema.sql;
