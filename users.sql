DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first_name VARCHAR NOT NULL,
     last_name VARCHAR NOT NULL,
     email VARCHAR NOT NULL UNIQUE,
     password VARCHAR NOT NULL,
     img_url VARCHAR,
     bio VARCHAR,
     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS secretcode CASCADE;

CREATE TABLE secretcode (
     id SERIAL PRIMARY KEY,
     email VARCHAR NOT NULL,
     secret_code VARCHAR NOT NULL,
     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships CASCADE;

CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id) NOT NULL,
      recipient_id INT REFERENCES users(id) NOT NULL,
      accepted BOOLEAN DEFAULT false
  );


DROP TABLE IF EXISTS chat CASCADE;

CREATE TABLE chat(
      id SERIAL PRIMARY KEY,
      chat VARCHAR,
      user_id INT REFERENCES users(id) NOT NULL
  );

DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts(
      id SERIAL PRIMARY KEY,
      post VARCHAR,
      wall_owner INT REFERENCES users(id) NOT NULL,
      author_id INT REFERENCES users(id) NOT NULL
  );
