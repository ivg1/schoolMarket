const jwt = require("jsonwebtoken");
const Users = require("../db/users");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../middleware/hashPassword");

const userLogin_post = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "missing username or password" });
        }

        let user;
        if (username.includes("@")) {
            user = await Users.auth.getUserByEmail(username);
        } else {
            user = await Users.auth.getUserByUsername(username);
        }
        console.log(user);

        if (!user) {
            return res.status(400).json({ error: "wrong username or password" });
        }

        const compareState = await bcrypt.compare(password, user.password_hash);

        if (compareState) {
            const token = jwt.sign({ 
                id: user.id
            }, process.env.JWT_SECRET);

            console.log("token verify: ", jwt.verify(token, process.env.JWT_SECRET));
            return res.status(200).json({ token });
        } else {
            return res.status(400).json({ error: "wrong username or password" });
        }

    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed logging in user" });
    }
}

const userSignup_post = async (req, res) => {
    try {
        const { 
            fname,
            lname,
            username, 
            password, 
            email, 
            phone
        } = req.body;

        //todo: make separate checks for username and email (for better feedback)
        const exists = await Users.checkUserExistence(username, email);

        if (exists) return res.status(400).json({ error: "user already exists" });

        //hash the password to store
        const password_hash = await hashPassword(password);
        
        
        const user = await Users.auth.signup(username, email, password_hash, phone, fname, lname);
        return res.status(201).json({ message: "user created (signed up)", user });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed creating user" });
    }
}

module.exports = { userLogin_post, userSignup_post };