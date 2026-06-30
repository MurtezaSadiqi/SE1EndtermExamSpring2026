export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === '23505') return res.status(409).json({ message: 'این اطلاعات قبلاً ثبت شده است' });
  res.status(err.status || 500).json({ message: err.message || 'خطای داخلی سرور' });
}
