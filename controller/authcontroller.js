
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { maketoken } = require("../util/maketoken");

exports.register = async (req, res, next) => {
    try {
        const { name, email, password ,confirmPassword} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password not found"
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "Email not found"
            });
        }
        if (!confirmPassword) {
            return res.status(400).json({
                message: "Confirm password not found"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        next(err);
    }
};



exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email not found"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password not found"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = maketoken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: user.email
            }
        });

    } catch (err) {
        next(err);
    }
};