const Users = require("../db/users");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../middleware/hashPassword");

const getNumUsers_get = async (req, res) => {
    try {
        const usersList = await Users.data.getNum();
        return res.status(200).json(usersList);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed getting all users" });
    }
}

const getUserById_get = async (req, res) => {
    try {
        const { id } = req.query;
        const user = await Users.auth.getUserById(id);
        console.log(user);

        if (!user) return res.status(404).json({ message: "user not found" });

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed getting user by id (fatal error in function that shouldnt have failed)" });
    }
}

const getAll_get = async (req, res) => {
    try {
        const usersList = await Users.data.getAll();
        return res.status(200).json(usersList);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed getting all users profiles" });
    }
}

const getUserDataByUsername_get = async (req, res) => {
    try {
        const { username } = req.query;
        const user = await Users.auth.getUserDataByUsername(username);
        console.log(user);

        if (!user) return res.status(404).json({ message: "user not found" });

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed getting user id by username (someone must be playing with the api)" });
    }
};

const privateGetDataById_get = async (req, res) => {
    try {
        const id = req.userId;
        const user = await Users.auth.private.getDataById(id);
        console.log(user);

        if (!user) return res.status(404).json({ message: "user not found" });

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed getting data by id in privateGetDataById_get" });
    }
}

/*
const createUser_post = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password_hash, 
            phone 
        } = req.body;

        //todo: make separate checks for username and email (for better feedback)
        const exists = await Users.checkUserExistence(username, email);

        if (exists) return res.status(400).json({ error: "user already exists" });

        const user = await Users.auth.signup(username, email, password_hash, phone);
        return res.status(201).json({ message: "user created (signed up)", user });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed creating user" });
    }
}
*/

const updateUser_post = async (req, res) => {
    try {
        const { username, email, phone, about, fname, lname, profile_image } = req.body;
        //this is new over here. dont forget to finish
        const id = req.userId;

        let userChanges = [];
        if (username) {
            userChanges.push(await Users.update.username(username, id));
        }
        //if (email) {
        //    userChanges.push(await Users.update.email(email, id));
        //}
        if (phone) {
            userChanges.push(await Users.update.phone(phone, id));
        }
        if (about) {
            userChanges.push(await Users.update.about(about, id));
        }
        if (fname) {
            userChanges.push(await Users.update.fname(fname, id));
        }
        if (lname) {
            userChanges.push(await Users.update.lname(lname, id));
        }
        if (profile_image) {
            userChanges.push(await Users.update.profile_image(profile_image, id));
        }

        console.log("user updated");
        return res.status(200).json({ changes: userChanges });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed updating user in controller" });
    }
}

const privateResetPass_post = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        console.log(old_password, new_password);
        const id = req.userId;

        const passHash = await Users.auth.returnPassHash(id);
        console.log(passHash);

        const match = await bcrypt.compare(old_password, passHash);
        console.log(match);

        if (!match) return res.status(401).json({ error: "old password doesnt match" });

        const password_hash = await hashPassword(new_password);
        const response2 = await Users.update.password(password_hash, id);
        if (!response2) return res.status(400).json({ error: "error storing new password hash" });
        
        console.log(response2);
        return res.status(201).json({ message: "new password set" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed resetting password in controller" });
    }
}

//same thing here, SECURE IT (when done with auth)
const deleteUser_post = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (req.is_admin || req.is_mod) {
            console.log("admin or mod deleting user");
            const result = await Users.danger.delete(id);
            return res.status(200).json({ deleted: result });
        } else {
            console.log("user deleting self");
            const passHash = await Users.auth.returnPassHash(id);
            const match = await bcrypt.compare(password, passHash);

            if (!passHash || !(await bcrypt.compare(password, passHash))) {
                console.log("wrong password given for deletion");
                return res.status(401).json({ error: "password doesn't match" });
            }

            const result = await Users.danger.delete(id);
            return res.status(200).json({ message: result });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "failed deleting user in controller"});
    }
}


//special for getting users as mod
const setUserMod_post = async (req, res) => {
    try {
        const { id } = req.body;
        //idk how to name this guy
        //const userRequester = await Users.auth.private.getDataById(req.userId);
        //hold up, this is useless cus i already checked in middleware
        //if (!userRequester.is_mod) return res.status(400).json({ error: "mate, you arent privileged to be allowed to do that lol"});

        const result = await Users.update.setMod(id);
        console.log(`set user of id ${id} as mod`);
        return res.status(200).json({ message: `set user of id ${id} as mod` });
    } catch (err) {
        console.error(err);
        console.log(`failed setting user of id ${id} as mod in controller`);
        return res.status(400).json({ error: `failed setting user of id ${id} as mod in controller`});
    }
}

const removeUserMod_post = async (req, res) => {
    try {
        const { id } = req.body;
        //idk how to name this guy
        //const userRequester = await Users.auth.private.getDataById(req.userId);
        //hold up, this is useless cus i already checked in middleware
        //if (!userRequester.is_admin) return res.status(400).json({ error: "mate, you arent privileged to be allowed to do that lol"});

        const result = await Users.update.removeMod(id);
        console.log(`removed mod from user of id ${id}`);
        return res.status(200).json({ message: `removed mod from user of id ${id}` });
    } catch (err) {
        console.error(err);
        console.log(`failed removing mod from user in controller`);
        return res.status(400).json({ error: `failed removing mod from user in controller`});
    }
}

module.exports = {
    getNumUsers_get,
    getUserById_get,
    // createUser_post,
    getUserDataByUsername_get,
    updateUser_post,
    deleteUser_post,

    privateGetDataById_get,
    privateResetPass_post,

    setUserMod_post,
    removeUserMod_post,

    getAll_get
}