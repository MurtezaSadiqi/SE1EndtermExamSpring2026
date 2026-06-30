import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const tokenFor = u => jwt.sign({ id: u.id, name: u.name, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'نام، ایمیل و رمز حداقل ۶ حرفی الزامی است' });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query('INSERT INTO users(name,email,password_hash) VALUES($1,LOWER($2),$3) RETURNING id,name,email,role', [name, email, hash]);
    res.status(201).json({ user: rows[0], token: tokenFor(rows[0]) });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM users WHERE email=LOWER($1)', [req.body.email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) return res.status(401).json({ message: 'ایمیل یا رمز عبور نادرست است' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: tokenFor(user) });
  } catch (e) { next(e); }
}
