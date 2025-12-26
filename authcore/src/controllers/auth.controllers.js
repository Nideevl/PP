import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/db.js';

export const signup = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const result = await query(
            `INSERT INTO users (username, email, password)
            VALUES ($1 ,$2, $3)
            RETURNING user_id, email, username`,
            [username, email, hash]
        )

        const token = jwt.sign(
            { user_id: result.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });

    }catch (err) {
        res.status(400).json({ error: 'Under already exists' });
    }
};

export const login = async(req,res) => {
    try{
        const {email, password} = req.body;

        const result = await query(
            `SELECT user_id, password_hash FROM users
            WHERE email = $1`,
            [email]
        );

        if(result.rows.length === 0) {
            return res.status(400).jsong({ error: 'User not found' });
        }

        const user = result.rows[0];

        const isValid = await bcrypt.compare(password, user.password_hash);

        if(!isValid) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }


        const token = jwt.sign(
            {user_id : user.user_id},
            process.env.JWT_SECRET,
            { expiresIn: 'ih'   }
        );

        res.json( {token })
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
}