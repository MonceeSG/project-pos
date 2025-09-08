const Model = require("../model/userModel");
const { generateToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/bcrypt");


class authController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Invalid Email Or Password" });
            }

            const user = await Model.findByUsername(username);
            console.log("User Found: ", user);

            if (!user || user.length === 0) {
                return res.status(401).json({ message: "Invalid Email Or Password" });
            }

            const isMatch = await comparePassword(password, user[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Email Or Password" });
            }

            const token = generateToken({ id: user[0].id, username: user[0].username });

            res.status(200).json({
                message: "Login Success",
                token: token,
                user: {
                    id: user[0].id,
                    username: user[0].username
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async register(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Invalid Username Or Password" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            const existingUser = await Model.findByUsername(username);
            if (existingUser && existingUser.length > 0) {
                return res.status(409).json({ message: "Username already exists" });
            }

            const hashedPassword = await hashPassword(password);
            await Model.createUser(username, hashedPassword);

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = authController;