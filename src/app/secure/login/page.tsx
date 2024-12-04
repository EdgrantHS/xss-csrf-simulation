'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './login.module.css';
import axios from 'axios';

// Fungsi untuk menghasilkan token CSRF acak
const generateCSRFToken = () => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return token;
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const response = await fetch('/api/secure/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)
      if (data.success) {
        console.log('Session Token:', data.sessionToken); 
        //console.log('username:', username);
        Cookies.set('session', data.sessionToken, { expires: 7, path: '/secure/', httpOnly: true, sameSite: 'Strict', secure: true });
        Cookies.set('username', username, { expires: 7, path: '/secure/' });
        
        // Jika username = admin, generate token CSRF dan simpan ke cookie
        if (username === 'admin') {
          const csrfToken = generateCSRFToken();
          console.log('CSRF Token:', csrfToken); // Opsional, hanya untuk verifikasi
        }

        alert('Login Successful');
        router.push('/secure/index'); 
      } else {
        alert(data.error || 'Login failed');
      }
      
    } else {
      alert('Please fill in both fields');
    }
  };

  // Cek apakah session token sudah ada
  useEffect(() => {
    // Mendapatkan session token dari cookies
    const session = Cookies.get('session');

    //Mengecek apakah session tersebut legit
    // Route:/api/secure/session?session=55gpoo1x25xrznr2ai83rs
    axios.get('/api/secure/session', {
      params: {
        session: session,
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.username) {
        router.push('/secure/index');
      }
    })
    .catch((error) => {
      console.table(error);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
