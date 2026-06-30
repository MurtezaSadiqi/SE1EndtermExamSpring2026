import { query } from '../config/db.js';

export async function list(req, res, next) {
  try {
    const { city, type, minPrice, maxPrice, guests } = req.query;
    const values = []; const where = ['active=TRUE'];
    const add = (value, expression) => { values.push(value); where.push(expression.replace('?', `$${values.length}`)); };
    if (city) add(`%${city}%`, 'city ILIKE ?');
    if (type) add(type, 'type = ?');
    if (minPrice) add(minPrice, 'price_per_night >= ?');
    if (maxPrice) add(maxPrice, 'price_per_night <= ?');
    if (guests) add(guests, 'capacity >= ?');
    const { rows } = await query(`SELECT * FROM properties WHERE ${where.join(' AND ')} ORDER BY rating DESC, created_at DESC LIMIT 100`, values);
    res.json(rows);
  } catch (e) { next(e); }
}

export async function one(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM properties WHERE id=$1 AND active=TRUE', [req.params.id]);
    rows[0] ? res.json(rows[0]) : res.status(404).json({ message: 'ملک پیدا نشد' });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const p = req.body;
    if (!p.title || !p.city || !p.address || !p.type || !p.pricePerNight || !p.capacity) return res.status(400).json({ message: 'فیلدهای ضروری کامل نیستند' });
    const { rows } = await query(`INSERT INTO properties(owner_id,title,description,city,address,type,price_per_night,capacity,amenities,image_urls)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [req.user.id,p.title,p.description||'',p.city,p.address,p.type,p.pricePerNight,p.capacity,p.amenities||[],p.imageUrls||[]]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
}
