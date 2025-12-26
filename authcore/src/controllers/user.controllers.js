import { query } from '../db/db.js';

export const getProfile = async(req, res) => {
    try {
        const { user_id } = req.user;

        const result = await query(
            `SELECT * FROM users WHERE user_id = $1;`,
            [user_id]
        );

        res.json({ profile: result.rows[0] });

    } catch {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProfile = async(req, res) => {
    try {
        const {user_id} = req.user;
        const {username} = req.body;

        console.log(username)
        const result = await query (
            `UPDATE users 
            SET username = $1
            WHERE user_id = $2
            RETURNING user_id, email, username`,
            [username , user_id]
        )

        console.log(result.rows[0])

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};