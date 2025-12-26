import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/db.js';

export const signup = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const hash = await bcrypt.hash(password, 10);
        
        const result = await query(
            `INSERT INTO users (username, email, password_hash)
            VALUES ($1 ,$2, $3)
            RETURNING user_id, email, username`,
            [username, email, hash]
        )
        console.log("u - ",username);

        const token = jwt.sign(
            { user_id: result.rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });

} catch (err) {
    console.error("Signup Error Details:", {
        message: err.message,
        detail: err.detail,
        code: err.code,
        stack: err.stack
    });
    res.status(400).json({ error: err.message || 'Server error' });
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
            return res.status(400).json({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        
        const isValid = await bcrypt.compare(password, user.password_hash);
        
        if(!isValid) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }
        
        console.log(result.rows[0]);
        
        const token = jwt.sign(
            {user_id : user.user_id},
            process.env.JWT_SECRET,
            { expiresIn: '1h'   }
        );

        res.json( {token })
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
};

