import { query } from '../config/db.js';

export async function recommend(req, res, next) {
  try {
    const [props, user] = await Promise.all([
      query('SELECT * FROM properties WHERE active=TRUE LIMIT 200'),
      query(`SELECT u.preferences,
        COALESCE(array_agg(DISTINCT p.city) FILTER(WHERE p.city IS NOT NULL),'{}') cities,
        COALESCE(array_agg(DISTINCT p.type) FILTER(WHERE p.type IS NOT NULL),'{}') types
        FROM users u LEFT JOIN favorites f ON f.user_id=u.id LEFT JOIN properties p ON p.id=f.property_id WHERE u.id=$1 GROUP BY u.id`, [req.user.id])
    ]);
    const profile = user.rows[0] || { preferences: {}, cities: [], types: [] };
    const response = await fetch(`${process.env.RECOMMENDATION_URL}/recommend`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ properties: props.rows, profile }) });
    if (!response.ok) throw new Error('سرویس پیشنهاددهی در دسترس نیست');
    res.json(await response.json());
  } catch(e) { next(e); }
}

export async function favorite(req, res, next) {
  try { await query('INSERT INTO favorites(user_id,property_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.user.id,req.params.id]); res.status(204).end(); } catch(e) { next(e); }
}
