# HomeStay — سامانه رزرو و پیشنهاد املاک

یک MVP با معماری سه‌لایه و MVC برای ثبت، جست‌وجو، رزرو و پیشنهاد ملک مطابق علایق کاربر.

## اجرا با Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- Recommendation service: http://localhost:8000

## امکانات

- ثبت‌نام و ورود با JWT
- ثبت و مشاهده املاک
- فیلتر بر اساس شهر، نوع، ظرفیت و بازه قیمت
- رزرو با کنترل تداخل تاریخ و محاسبه مبلغ
- ثبت وضعیت پرداخت
- علاقه‌مندی و پیشنهاد ملک بر اساس شهر، نوع و امکانات محبوب
- PostgreSQL، Redis و Elasticsearch (سرویس‌ها در Compose آماده‌اند)

## اجرای توسعه‌ای

فایل `.env.example` را به `.env` کپی کنید. سپس در پوشه‌های `backend`، `frontend` و `recommendation` وابستگی‌ها را نصب و سرویس‌ها را اجرا کنید.

حساب مدیر را می‌توان با ثبت‌نام عادی ساخت و نقش آن را مستقیماً در دیتابیس به `ADMIN` تغییر داد.

## آزمون‌ها

آزمون‌های واحد و پذیرش کلاس `RecommendationEngine` در شاخه `test` قرار دارند:

```bash
cd recommendation
python -m unittest discover -s tests -v
```
