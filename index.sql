CREATE DATABASE IF NOT EXISTS instrumentosMusicais;
USE instrumentosMusicais;

CREATE TABLE IF NOT EXISTS instrumentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instrumento VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    tipo VARCHAR(10) NOT NULL
);
