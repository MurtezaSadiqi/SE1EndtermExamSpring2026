import { pool, query } from '../config/db.js';

export async function create(req, res, next) {
  const client = await pool.connect();
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;
    if (!propertyId || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) return res.status(400).json({ message: 'تاریخ رزرو نامعتبر است' });
    await client.query('BEGIN');
    const property = (await client.query('SELECT * FROM properties WHERE id=$1 AND active=TRUE FOR UPDATE', [propertyId])).rows[0];
    if (!property || guests > property.capacity) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'ملک یا ظرفیت نامعتبر است' }); }
    const clash = await client.query(`SELECT 1 FROM bookings WHERE property_id=$1 AND status<>'CANCELLED' AND check_in < $3 AND check_out > $2`, [propertyId, checkIn, checkOut]);
    if (clash.rowCount) { await client.query('ROLLBACK'); return res.status(409).json({ message: 'این بازه قبلاً رزرو شده است' }); }
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    const total = Number(property.price_per_night) * nights;
    const booking = (await client.query(`INSERT INTO bookings(user_id,property_id,check_in,check_out,guests,total_price) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [req.user.id,propertyId,checkIn,checkOut,guests,total])).rows[0];
    await client.query(`INSERT INTO payments(booking_id,amount) VALUES($1,$2)`, [booking.id,total]);
    await client.query('COMMIT');
    res.status(201).json(booking);
  } catch(e) { await client.query('ROLLBACK'); next(e); } finally { client.release(); }
}

export async function mine(req, res, next) {
  try { const { rows } = await query(`SELECT b.*,p.title,p.city,p.image_urls FROM bookings b JOIN properties p ON p.id=b.property_id WHERE b.user_id=$1 ORDER BY b.created_at DESC`, [req.user.id]); res.json(rows); } catch(e) { next(e); }
}

export async function pay(req, res, next) {
  try {
    const { rows } = await query(`UPDATE payments p SET status='PAID',reference=$1 FROM bookings b WHERE p.booking_id=b.id AND b.id=$2 AND b.user_id=$3 AND p.status='PENDING' RETURNING p.*`, [req.body.reference || `MOCK-${Date.now()}`, req.params.id, req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: 'پرداخت قابل انجام نیست' });
    await query(`UPDATE bookings SET status='CONFIRMED' WHERE id=$1`, [req.params.id]);
    res.json(rows[0]);
  } catch(e) { next(e); }
}
