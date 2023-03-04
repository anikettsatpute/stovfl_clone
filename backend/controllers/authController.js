import { User } from "../models/usersModel.js";
import { Auth } from "../models/authModel.js";
import { sha256 } from "js-sha256";
import jwt from "jsonwebtoken";

let secretpassword = "False hopes are more dangerous than fears";
let salt = sha256(secretpassword);
export const checkToken = async (req, res, next) => {
    try {
        let token = req.token;
        if (!token) {
            res.json({
                success: false,
                message: "Error! Token was not provided."
            });
        }
        else {
            const decodedToken = jwt.verify(token, salt);
            const user = await Auth.findAll({
                where: {
                    user_name: decodedToken.user_name
                }
            })
            if (!user) {
                res.json({
                    success: false
                });

            }
            else {
                req.json({
                    user_name: decodedToken.user_name
                });
                next();
            }
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const authUser = async (req, res) => {
    try {
        const passlist = await Auth.findAll({
            where: {
                user_name: req.body.user_name
            }
        })
        const pass = passlist[0].dataValues;
        const userlist = await User.findAll({
            where: {
                id: pass.id
            }
        })
        const user = userlist[0].dataValues;
        let enpass = sha256(req.body.password + user.creation_date);

        if (pass.pass === enpass) {
            let token = jwt.sign({ username: pass.user_name }, salt);
            res.json({
                username: pass.username,
                token: token,
                outcome: "Success",
            });
        }
        else {
            res.json({ outcome: "Fail" });
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const createUser = async (req, res) => {
    try {
        let password = sha256(req.body.password + req.body.creation_date); //salted hash
        req.body.delete(password);
        let user = await User.create(req.body);
        let username = req.body.display_name + "@" + user.id;
        await Auth.create({
            id: req.body.id,
            user_name: username,
            pass: password
        })
        let token = jwt.sign({ user_name: username }, salt);
        res.json({
            user_name: username,
            token: token,
            success: true,
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}