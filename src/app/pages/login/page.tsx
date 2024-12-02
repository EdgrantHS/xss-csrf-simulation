'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './login.module.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const response = await fetch('/api/pages/login', {
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
        Cookies.set('session', data.sessionToken, { expires: 7, path: '/pages/', sameSite: 'none', secure: true });
        Cookies.set('username', username, { expires: 7, path: '/pages/' });
        alert('Login Successful');
        router.push('/pages/index'); 
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
    // Route:/api/pages/session?session=55gpoo1x25xrznr2ai83rs
    axios.get('/api/pages/session', {
      params: {
        session: session,
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.username) {
        router.push('/pages/index');
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
