const { pool } = require("./db.js");

const Listings = {
    data: {
        async getHeroAll() {
            try {
                const result = await pool.query(`
                    SELECT
                        id,
                        seller_id,

                        CASE
                            WHEN awaiting_moderation
                            THEN 'awaiting moderation'
                            ELSE title
                        END AS title,

                        CASE
                            WHEN awaiting_moderation
                            THEN 'awaiting moderation'
                            ELSE description
                        END AS description,

                        CASE
                            WHEN awaiting_moderation
                            THEN 1
                            ELSE price
                        END AS price,

                        CASE
                            WHEN awaiting_moderation
                            THEN NULL
                            ELSE tags
                        END AS tags,

                        CASE
                            WHEN awaiting_moderation
                            THEN NULL
                            ELSE images
                        END AS images,

                        CASE
                            WHEN awaiting_moderation
                            THEN CURRENT_TIMESTAMP
                            ELSE created_at
                        END AS created_at,

                        is_physical,
                        negotiable,

                        school_system,
                        school,
                        other_school,
                        school_class,
                        condition,

                        email_show,
                        phone_show,

                        awaiting_moderation

                    FROM listings
                    WHERE visibility = true
                    ORDER BY
                        awaiting_moderation ASC,
                        created_at DESC
                `);
                //      ^ pg puts false first

                return result.rows;
            } catch (err) {
                console.error("error in listings db data.getHeroAll()", err);
                throw err;
            }
        },
        async getHeroAllByUser(id) {
            try {
                const result = await pool.query(`
            SELECT
                id,
                seller_id,

                CASE
                    WHEN awaiting_moderation
                    THEN 'awaiting moderation'
                    ELSE title
                END AS title,

                CASE
                    WHEN awaiting_moderation
                    THEN 'awaiting moderation'
                    ELSE description
                END AS description,

                CASE
                    WHEN awaiting_moderation
                    THEN 1
                    ELSE price
                END AS price,

                CASE
                    WHEN awaiting_moderation
                    THEN NULL
                    ELSE tags
                END AS tags,

                CASE
                    WHEN awaiting_moderation
                    THEN NULL
                    ELSE images
                END AS images,

                CASE
                    WHEN awaiting_moderation
                    THEN CURRENT_TIMESTAMP
                    ELSE created_at
                END AS created_at,

                is_physical,
                negotiable,

                school_system,
                school,
                other_school,
                school_class,
                condition,

                email_show,
                phone_show,

                awaiting_moderation

            FROM listings
            WHERE
                visibility = true
                AND seller_id = $1
            ORDER BY
                awaiting_moderation ASC,
                created_at DESC
        `, [id]);

                return result.rows;
            } catch (err) {
                console.error("error in listings db data.getHeroAllByUser()", err);
                throw err;
            }
        },
        async getFullData(id) {
            try {
                const result = await pool.query("SELECT * FROM listings WHERE id = $1", [id]);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db data.getFullData()", err);
                throw err;
            }
        },
        async getNum() {
            try {
                const result = await pool.query("SELECT COUNT(*) FROM listings");
                console.log("db fetched number of rows in listings");
                return result.rows[0];
            } catch (err) {
                console.error("error in listings db data.getNum()", err);
                throw err;
            }
        },
        mods: {
            async getHeroAll() {
                try {
                    const result = await pool.query("SELECT id, title, description, price, tags, images, created_at, awaiting_moderation, is_physical FROM listings ORDER BY awaiting_moderation DESC, created_at DESC");
                    return result.rows;
                } catch (err) {
                    console.error("error in listings db data.getHeroAll()", err);
                    throw err;
                }
            },
        }   

    },
    async create(
        title,
        description,
        price,
        seller_email,
        seller_phone,
        seller_id,
        tags,
        images,
        phone_show,
        email_show,
        is_physical,
        negotiable,
        school_system,
        school,
        other_school,
        school_class,
        condition
    ) {
        const query = "INSERT INTO listings (title, description, price, seller_email, seller_phone, seller_id, tags, images, phone_show, email_show, is_physical, negotiable, school_system, school, other_school, school_class, condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id";
        const values = [
            title,
            description,
            price,
            seller_email,
            seller_phone,
            seller_id,
            tags,
            images,
            phone_show,
            email_show,
            is_physical,
            negotiable,
            school_system,
            school,
            other_school,
            school_class,
            condition
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (err) {
            console.error("error in listings db create()", err);
            throw err;
        }
    },
    update: {
        async title(new_title, id) {
            const query = "UPDATE listings SET title = $1 WHERE id = $2 RETURNING *";
            const values = [new_title, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.title()", err);
                throw err;
            }
        },
        async desc(new_desc, id) {
            const query = "UPDATE listings SET description = $1 WHERE id = $2 RETURNING *";
            const values = [new_desc, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.desc()", err);
                throw err;
            }
        },
        async price(new_price, id) {
            const query = "UPDATE listings SET price = $1 WHERE id = $2 RETURNING *";
            const values = [new_price, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.price()", err);
                throw err;
            }
        },
        async emailShow(new_state, id) {
            const query = "UPDATE listings SET emailShow = $1 WHERE id = $2 RETURNING *";
            const values = [new_state, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.emailShow()", err);
                throw err;
            }
        },
        async phoneShow(new_state, id) {
            const query = "UPDATE listings SET phoneShow = $1 WHERE id = $2 RETURNING *";
            const values = [new_state, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.phoneShow()", err);
                throw err;
            }
        },
        async tags(new_tags, id) {
            const query = "UPDATE listings SET tags = $1 WHERE id = $2 RETURNING *";
            const values = [new_tags, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.tags()", err);
                throw err;
            }
        },
        async negotiable(negotiable, id) {
            const query = "UPDATE listings SET negotiable = $1 WHERE id = $2 RETURNING *";
            const values = [negotiable, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.negotiable()", err);
                throw err;
            }
        },
        async seller_email(seller_email, id) {
            const query = "UPDATE listings SET seller_email = $1 WHERE id = $2 RETURNING *";
            const values = [seller_email, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.seller_email()", err);
                throw err;
            }
        },
        async seller_phone(seller_phone, id) {
            const query = "UPDATE listings SET seller_phone = $1 WHERE id = $2 RETURNING *";
            const values = [seller_phone, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.seller_phone()", err);
                throw err;
            }
        },
        async email_show(email_show, id) {
            const query = "UPDATE listings SET email_show = $1 WHERE id = $2 RETURNING *";
            const values = [email_show, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.email_show()", err);
                throw err;
            }
        },
        async phone_show(phone_show, id) {
            const query = "UPDATE listings SET phone_show = $1 WHERE id = $2 RETURNING *";
            const values = [phone_show, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.phone_show()", err);
                throw err;
            }
        },

        async visibility(new_state, id) {
            const query = "UPDATE listings SET visibility = $1 WHERE id = $2 RETURNING *";
            const values = [new_state, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.visibility()", err);
                throw err;
            }
        },

        async awaiting_moderation(new_state, id) {
            const query = "UPDATE listings SET awaiting_moderation = $1 WHERE id = $2 RETURNING *";
            const values = [new_state, id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.awaiting_moderation()", err);
                throw err;
            }
        }
    },
    danger: {
        async delete(id) {
            try {
                const result = await pool.query("DELETE FROM listings WHERE id = $1 RETURNING *", [id]);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db danger.delete()", err);
                throw err;
            }
        }
    },
    mods: {
        async accept(id) {
            const query = "UPDATE listings SET awaiting_moderation = false, visibility = true WHERE id = $1 RETURNING *";
            const values = [id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.mods.approve()", err);
                throw err;
            }
        },
        async reject(id) {
            const query = "UPDATE listings SET awaiting_moderation = true, visibility = false WHERE id = $1 RETURNING *";
            const values = [id];
            try {
                const result = await pool.query(query, values);
                return result.rows[0] || null;
            } catch (err) {
                console.error("error in listings db update.mods.reject()", err);
                throw err;
            }
        }
    }
};

module.exports = Listings;