DROP DATABASE IF EXISTS question_db;
CREATE DATABASE question_db;

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS question;


CREATE TABLE question (
  id SERIAL NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  -- date INT NOT NULL DEFAULT CURRENT_TIME,
    date INT NOT NULL,
  question_helpfulness INT,
  reported BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE answer (
  id SERIAL NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answer_body VARCHAR(1000) NOT NULL,
  -- date INT NOT NULL DEFAULT CURRENT_TIME,
    date INT NOT NULL,
  answer_helpfulness INT NOT NULL DEFAULT 0,
  question_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT questions_fkey FOREIGN KEY (question_id) REFERENCES question (id)
);

CREATE TABLE photos (
  url VARCHAR(65000),
  answer_id INT NOT NULL,
  CONSTRAINT answers_fkey FOREIGN KEY (answer_id) REFERENCES answer (id)
);
/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *FOR POSTSQL psql -u postgres < sever/schema.sql
 *  to create the database and the tables.
* psql -U postgres -h 127.0.0.1 -f ./schema.sql;*/


