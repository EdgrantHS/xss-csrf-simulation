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
      console.log(data);
      if (data.success) {
        //console.log('Session Token:', data.sessionToken);

        // Set session and username cookies after successful login
        Cookies.set('session', data.sessionToken, { expires: 7, path: '/', sameSite: 'none', secure: true });
        //Cookies.set('username', username, { expires: 7, path: '/' });

        /*// Send a request to generate the CSRF token
        const csrfResponse = await fetch('/api/secure/csrf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }), // Send username in the request body
        });

        if (csrfResponse.ok) {
          console.log('CSRF token generated successfully');
        } else {
          console.error('Failed to generate CSRF token');
        }*/

        alert('Login Successful');
        router.push('/pages/index');
      } else {
        alert(data.error || 'Login failed');
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  // Check if session token already exists
  useEffect(() => {
    const session = Cookies.get('session');

    // Check if session is legit
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
      console.error(error);
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
