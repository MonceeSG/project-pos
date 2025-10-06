const pool = require('../config/db');

class UserModel {
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
                if (error) {
                    return reject(error);
                }
                const mappedResults = results.map(user => ({
                    id: user.id,
                    username: user.username,
                    password: user.password
                }));
                resolve(results);
            });
        })
    }

    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT id, username FROM users', (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getUserById(id) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT id, username FROM users WHERE id = ?', [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0] || null);
            });
        });
    }
    
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
                if (error) {
                    return reject(error);
                }
                const mappedResults = results.map(user => ({
                    id: user.id,
                    username: user.username,
                    password: user.password
                }));
                resolve(results);
            });
        })
    }

    static async createUser(username, password) {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results.insertId);
            });
        });
    }
    
    // Fungsi untuk update user
    static async updateUser(id, username, password) {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
    
    // Fungsi untuk delete user
    static async deleteUser(id) {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = UserModel;