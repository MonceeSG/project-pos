const { hash } = require('bcryptjs');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');

class UserController {
    // Create User
    static async createUser(req, res) {
        try {
            const { username, password } = req.body;
            const userId = await userModel.createUser(username, password);
            res.status(201).json({ message: "User created", userId });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await userModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }   
    }

    // Get User by Username
    static async findByUsername(req, res) {
        try {
            const { username } = req.params;
            const user = await userModel.findByUsername(username);
            if (!user || user.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user[0]);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Get User By ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Update User
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { username, password } = req.body;

            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const result = await userModel.updateUser(id, username, hashedPassword);

            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User updated" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Delete User
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userModel.deleteUser(id);
            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = UserController;