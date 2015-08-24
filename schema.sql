DROP TABLE IF EXISTS forums;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS topics;


CREATE TABLE forums(
	id integer PRIMARY KEY AUTOINCREMENT,
	user_id varchar,
	title varchar,
	topic varchar,
	topic_id INTEGER,
	content TEXT,
	last_updated varchar,
	votes INTEGER,
	created_on DATE DEFAULT (strftime('%Y-%m-%d %H:%M:%S'))
);

CREATE TABLE users(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username varchar,
	password varchar,
	comments INTEGER
);

CREATE TABLE comments(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	content TEXT,
	votes INTEGER,
	creator varchar,
	forum_id INTEGER,
	time_posted DATE DEFAULT (datetime('now','localtime'))
);

CREATE TABLE topics(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	posts varchar
);

INSERT INTO comments (content , votes , creator , forum_id) VALUES ('swapp is killing it',0,'swap',1);
INSERT INTO comments (content , votes , creator , forum_id) VALUES ('swapp is killing it',0,'riaz',1);
INSERT INTO comments (content , votes , creator , forum_id) VALUES ('swapp is killing it',0,'peter',1);
INSERT INTO comments (content , votes , creator , forum_id) VALUES ('swapp is killing it',0,'Anna',1);
INSERT INTO comments (content , votes , creator , forum_id) VALUES ('swapp is killing it',0,'Sung',1);
