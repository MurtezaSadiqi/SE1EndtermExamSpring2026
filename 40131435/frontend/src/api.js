const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export async function api(path, options={}) {
  const token = localStorage.getItem('token');
  const response = await fetch(BASE + path, { ...options, headers: { 'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {}), ...options.headers } });
  if (!response.ok) { const body = await response.json().catch(()=>({})); throw new Error(body.message || 'خطا در ارتباط با سرور'); }
  return response.status === 204 ? null : response.json();
}
