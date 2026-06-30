import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './api';
import './style.css';

const money = n => new Intl.NumberFormat('fa-IR').format(n);

function Auth({ onDone }) {
  const [register,setRegister]=useState(false), [form,setForm]=useState({name:'',email:'',password:''}), [error,setError]=useState('');
  const submit=async e=>{e.preventDefault();setError('');try{const r=await api(`/auth/${register?'register':'login'}`,{method:'POST',body:JSON.stringify(form)});localStorage.setItem('token',r.token);localStorage.setItem('user',JSON.stringify(r.user));onDone(r.user)}catch(e){setError(e.message)}};
  return <div className="auth"><form onSubmit={submit}><h2>{register?'ساخت حساب':'ورود'}</h2>{register&&<input placeholder="نام" onChange={e=>setForm({...form,name:e.target.value})}/>}<input type="email" placeholder="ایمیل" onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="رمز عبور" onChange={e=>setForm({...form,password:e.target.value})}/>{error&&<p className="error">{error}</p>}<button>ادامه</button><a onClick={()=>setRegister(!register)}>{register?'حساب دارم':'ثبت‌نام می‌کنم'}</a></form></div>
}

function App(){
 const [items,setItems]=useState([]),[filters,setFilters]=useState({city:'',guests:''}),[user,setUser]=useState(()=>JSON.parse(localStorage.getItem('user')||'null')),[auth,setAuth]=useState(false),[selected,setSelected]=useState(null),[message,setMessage]=useState('');
 const load=async()=>{const q=new URLSearchParams(Object.entries(filters).filter(([,v])=>v));setItems(await api('/properties?'+q))};
 useEffect(()=>{load().catch(e=>setMessage(e.message))},[]);
 const recommendations=async()=>{if(!user)return setAuth(true);try{setItems(await api('/recommendations'));setMessage('پیشنهادها بر اساس علاقه‌های شما مرتب شدند.')}catch(e){setMessage(e.message)}};
 const reserve=async e=>{e.preventDefault();if(!user)return setAuth(true);const f=new FormData(e.currentTarget);try{await api('/bookings',{method:'POST',body:JSON.stringify({propertyId:selected.id,checkIn:f.get('in'),checkOut:f.get('out'),guests:+f.get('guests')})});setSelected(null);setMessage('رزرو ثبت شد؛ از API پرداخت می‌توانید آن را تأیید کنید.')}catch(e){setMessage(e.message)}};
 const logout=()=>{localStorage.clear();setUser(null)};
 return <><header><div className="brand">خانه‌جو</div><nav><button className="ghost" onClick={recommendations}>پیشنهاد برای من</button>{user?<><span>{user.name}</span><button className="ghost" onClick={logout}>خروج</button></>:<button onClick={()=>setAuth(true)}>ورود</button>}</nav></header>
 <main><section className="hero"><div><span className="eyebrow">سفر از همین‌جا شروع می‌شود</span><h1>اقامتگاهی که با حال‌وهوای تو جور است.</h1><p>ویلا، کلبه و آپارتمان را پیدا کن و با خیال راحت رزرو کن.</p></div><form className="search" onSubmit={e=>{e.preventDefault();load()}}><label>مقصد<input placeholder="مثلاً کابل" value={filters.city} onChange={e=>setFilters({...filters,city:e.target.value})}/></label><label>تعداد مهمان<input type="number" min="1" value={filters.guests} onChange={e=>setFilters({...filters,guests:e.target.value})}/></label><button>جست‌وجو</button></form></section>
 {message&&<div className="notice">{message}</div>}<div className="section-title"><h2>اقامتگاه‌ها</h2><span>{money(items.length)} نتیجه</span></div><section className="grid">{items.map(p=><article className="card" key={p.id}><div className="photo" style={{backgroundImage:`url(${p.image_urls?.[0]||'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'})`}}><span>{p.type}</span></div><div className="card-body"><div className="row"><h3>{p.title}</h3><b>★ {p.rating}</b></div><p>{p.city} · تا {money(p.capacity)} مهمان</p><div className="row"><strong>{money(p.price_per_night)} تومان <small>/ شب</small></strong><button onClick={()=>setSelected(p)}>رزرو</button></div></div></article>)}</section>{!items.length&&<div className="empty">هنوز ملکی ثبت نشده است. با endpoint مربوط به میزبان اولین ملک را اضافه کنید.</div>}</main>
 {auth&&<Auth onDone={u=>{setUser(u);setAuth(false)}}/>}{selected&&<div className="modal" onClick={()=>setSelected(null)}><form onSubmit={reserve} onClick={e=>e.stopPropagation()}><button type="button" className="close" onClick={()=>setSelected(null)}>×</button><h2>رزرو {selected.title}</h2><label>تاریخ ورود<input name="in" type="date" required/></label><label>تاریخ خروج<input name="out" type="date" required/></label><label>مهمان<input name="guests" type="number" min="1" max={selected.capacity} defaultValue="1" required/></label><button>ثبت رزرو</button></form></div>}</>
}
createRoot(document.getElementById('root')).render(<App/>);
