const { pool } = require("./db.js");

const Users = {
    async me(id) {
        try {
            const result = await pool.query("SELECT id, username, profile_image, role, is_mod, is_admin FROM users WHERE id = $1", [id]);
            return result.rows[0];
        } catch (err) {
            console.error("error in users db me()", err);
        }
    },
    auth: {
        async signup(username, email, password_hash, phone, fname, lname) {
            const query = "INSERT INTO users (username, email, password_hash, phone, fname, lname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email";
            const values = [username, email, password_hash, phone, fname, lname];

            try {
                const result = await pool.query(query, values);
                console.log("db created account");
                return result.rows[0];
            } catch (err) {
                console.error("error in users db signup()", err);
                throw err;
            }
        },
        async login(username, password_hash) {
            const query = "SELECT * FROM users WHERE email = $1 AND password_hash = $2";
            const values = [username, password_hash];

            try {
                const result = await pool.query(query, values);
                console.log("db fetched user by login");
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db login()", err);
                throw err;
            }
        },
        //use only on server
        //i think i might not use this function
        async returnPassHash(id) {
            const query = "SELECT password_hash FROM users WHERE id = $1";
            const values = [id];

            try {
                const result = await pool.query(query, values);
                console.log("db returned a password_hash");
                return result.rows[0].password_hash || null;
            } catch (err) {
                console.error("error in user db checkPassMatch()", err);
                throw err;
            }
        },
        //use only on server
        async getUserByEmail(email) {
            const query = "SELECT * FROM users WHERE email = $1";
            const values = [email];

            try {
                const result = await pool.query(query, values);
                console.log("db fetched user by email");
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db getUserByEmail()", err);
                throw err;
            }
        },

        async getUserByUsername(username) {
            const query = "SELECT * FROM users WHERE username = $1";
            const values = [username];

            try {
                const result = await pool.query(query, values);
                console.log("db fetched user by username");
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db getUserByEmail()", err);
                throw err;
            }
        },
        async getUserById(id) {
            //i didnt put phone here cus idk 
            const query = "SELECT id, username, email, profile_image, fname, lname, created_at, listings_posted, about, is_mod, is_admin FROM users WHERE id = $1";

            try {
                const result = await pool.query(query, [id]);
                if (result.rows.length > 0) {
                    console.log(`user of id ${id} found`);
                    return result.rows[0];
                }

                console.log("no user found");
                return null;
            } catch (err) {
                console.error("error in users db auth.getUserById()", err);
                throw err;
            }
        },
        async getUserDataByUsername(username) {
            const query = "SELECT id, username, email, phone, profile_image, fname, lname, created_at, listings_posted, about FROM users WHERE username = $1";

            try {
                const result = await pool.query(query, [username]);
                if (result.rows.length > 0) {
                    console.log(`user of username ${username} found`);
                    return result.rows[0];
                }

                console.log("no user found");
                return null;
            } catch (err) {
                console.error("error in users db auth.getListingDataByUsername()", err);
                throw err;
            }
        },
        private: {
            async getDataById(id) {
                const query = "SELECT id, username, email, phone, profile_image, fname, lname, created_at, listings_posted, about, role, is_mod, is_admin FROM users WHERE id = $1";

                try {
                    const result = await pool.query(query, [id]);
                    if (result.rows.length > 0) {
                        console.log(`user of id ${id} found`);
                        return result.rows[0];
                    }

                    console.log("no user found");
                    return null;
                } catch (err) {
                    console.error("error in users db auth.getUserById()", err);
                    throw err;
                }
            }
        }
    },
    async checkUserExistence(username, email) {
        const query = "SELECT id FROM users WHERE username = $1 OR email = $2";
        try {
            const result = await pool.query(query, [username, email]);
            return result.rows.length > 0;
        } catch (err) {
            console.error("error in users db checkUserExistence()", err);
            throw err;
        }
    },
    data: {
        async getNum() {
            try {
                const result = await pool.query("SELECT COUNT(*) FROM users");
                console.log("db fetched number of rows in users");
                return result.rows[0];
            } catch (err) {
                console.error("error in users db data.getNum()", err);
                throw err;
            }
        },
        async getAll() {
            try {
                const result = await pool.query("SELECT id, username, fname, lname, about, is_mod, is_admin, profile_image FROM users");
                console.log("db fetched all users profile data in users");
                return result.rows;
            } catch (err) {
                console.error("error in users db data.getAll()", err);
                throw err;
            }
        }
    },
    update: {
        async username(username, id) {
            const query = "UPDATE users SET username = $1 WHERE id = $2 RETURNING *";
            const values = [username, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed username for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.username()", err);
                throw err;
            }
        },
        async password(password_hash, id) {
            const query = "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *";
            const values = [password_hash, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed password for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.password()", err);
                throw err;
            }
        },
        async email(email, id) {
            const query = "UPDATE users SET email = $1 WHERE id = $2 RETURNING *";
            const values = [email, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed email for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.email()", err);
                throw err;
            }
        },
        async phone(phone, id) {
            const query = "UPDATE users SET phone = $1 WHERE id = $2 RETURNING *";
            const values = [phone, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed phone for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.phone()", err);
                throw err;
            }
        },
        async about(about, id) {
            const query = "UPDATE users SET about = $1 WHERE id = $2 RETURNING *";
            const values = [about, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed about for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.about()", err);
                throw err;
            }
        },
        async fname(fname, id) {
            const query = "UPDATE users SET fname = $1 WHERE id = $2 RETURNING *";
            const values = [fname, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed fname for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.fname()", err);
                throw err;
            }
        },
        async lname(lname, id) {
            const query = "UPDATE users SET lname = $1 WHERE id = $2 RETURNING *";
            const values = [lname, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed lname for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.lname()", err);
                throw err;
            }
        },
        async profile_image(profile_image, id) {
            const query = "UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING *";
            const values = [profile_image, id];

            try {
                const result = await pool.query(query, values);
                console.log(`db changed profile_image for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.profile_image()", err);
                throw err;
            }
        },

        //stats
        async incrementCreatedStat(id) {
            const query = "UPDATE users SET listings_posted = listings_posted + 1 WHERE id = $1 RETURNING *";
            const values = [id];

            try {
                const result = await pool.query(query, values);
                console.log(`db incremented listings_posted stat for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.incrementCreatedStat()", err);
                throw err;
            }
        },

        async setMod(id) {
            const query = "UPDATE users SET is_mod = true, role = 'mod' WHERE id = $1 RETURNING *";
            const values = [id];

            try {
                const result = await pool.query(query, values);
                console.log(`db set mod true for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.setMod()", err);
                throw err;
            }
        },
        async removeMod(id) {
            const query = "UPDATE users SET is_mod = false, role = 'normal' WHERE id = $1 RETURNING *";
            const values = [id];

            try {
                const result = await pool.query(query, values);
                console.log(`db set mod false for user id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db update.removeMod()", err);
                throw err;
            }
        }
    },
    danger: {
        async delete(id) {
            try {
                await pool.query("DELETE FROM listings WHERE seller_id = $1", [id]);
                const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
                console.log(`db deleted user of id ${id}`);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in users db danger.delete()", err);
                throw err;
            }
        }
    }
};

module.exports = Users;