CREATE DATABASE firstapi;


CREATE TABLE users( id SERIAL PRIMARY KEY,
                                      name VARCHAR(40),
                                           email TEXT);


INSERT INTO users (name, email)
VALUES ('John',
        'johnIBM@gmail.com'),
        ('Ulises',
        'colosimo101@gmail.com'),
        ('Juan',
        'Juan0029@gmail.com');