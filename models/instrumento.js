const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'instrumentosMusicais',
});

// Busca todos os instrumentos
async function getInstrumento() {
    const sql = 'SELECT * FROM instrumentos';
    return new Promise(function (_then, _catch) {
        connection.query(sql, (err, results) => {
            if (!err) _then(results);
            else _catch(err);
        });
    });
}

// Inclui novo instrumento
async function incluiInstrumento(novo) {
    const sql = 'INSERT INTO instrumentos (instrumento, quantidade, tipo) VALUES (?, ?, ?)';
    const values = [novo.instrumento, novo.quantidade, novo.tipo];
    return new Promise(function (_then, _catch) {
        connection.query(sql, values, (err, results) => {
            if (!err) _then(results);
            else _catch(err);
        });
    });
}

// Altera instrumento existente
async function alteraInstrumento(novo) {
    const sql = 'UPDATE instrumentos SET instrumento = ?, quantidade = ?, tipo = ? WHERE id = ?';
    const values = [novo.instrumento, novo.quantidade, novo.tipo, novo.id];
    return new Promise(function (_then, _catch) {
        connection.query(sql, values, (err, results) => {
            if (!err) _then(results);
            else _catch(err);
        });
    });
}

// Apaga um instrumento
async function apagaInstrumento(id) {
    const sql = 'DELETE FROM instrumentos WHERE id = ?';
    return new Promise(function (_then, _catch) {
        connection.query(sql, [id], (err, results) => {
            if (!err) _then(results);
            else _catch(err);
        });
    });
}

module.exports = {
    getInstrumento,
    incluiInstrumento,
    alteraInstrumento,
    apagaInstrumento
};
