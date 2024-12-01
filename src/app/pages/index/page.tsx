'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import BlogPost from '../../components/BlogPost';
import styles from './index.module.css';
import { set } from 'mongoose';

const IndexPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);  
  const [loading, setLoading] = useState<boolean>(true);  
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionToken = Cookies.get('session'); 
  
      if (!sessionToken) {
        console.log("No session token found. Redirecting to login.");
        router.push('/pages/login');  
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3000/api/pages/session?session=${sessionToken}`);
        const data = await response.json();
  
        // Akses sessionToken dari data yang diterima
        console.log("Data from API:", data);
        const sessionTokenFromAPI = data.username
        setUsername(sessionTokenFromAPI);
  
        console.log("Session Token from API:", sessionTokenFromAPI);
  
        if (response.ok && sessionTokenFromAPI) {
          fetchBlogs();  
        } else {
          console.log(sessionTokenFromAPI);
          console.log("Invalid session. Redirecting to login.");
          router.push('/pages/login'); 
        }
      } catch (err) {
        console.error(err);
        console.log("Error with session verification. Redirecting to login.");
        router.push('/pages/login'); 
      }
    };
  
    fetchSession();  
  }, [router]);
  

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/pages/blog'); 
      const data = await response.json();
      
      if (response.ok) {
        setBlogs(data.blogs);  
      } else {
        setError(data.error || 'Failed to load blogs');  
      }
    } catch (err) {
      setError('Failed to load blogs'); 
    } finally {
      setLoading(false); 
    }
  };

  const handleAddBlog = () => {
    router.push('/pages/add-blog');
  };

  const handleLogout = () => {
    // Clear all cookies
    Cookies.remove('session', {path: '/'});
    Cookies.remove('session', {path: '/pages/'});
    Cookies.remove('username', {path: '/pages/'});

    console.log("Logging out...");
    router.push('/pages/login');  
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Blog {username}</h1>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>

      <div className={styles.blogs}>
        {loading ? (
          <p>Loading blogs...</p>  
        ) : error ? (
          <p>{error}</p> 
        ) : blogs.length === 0 ? (
          <p>No blogs added yet!</p>  
        ) : (
          blogs.map((blog: any) => (
            <BlogPost key={blog._id} title={blog.title} content={blog.body} />
          ))
        )}
      </div>
      <button onClick={handleAddBlog} className={styles.addButton}>
        Add Blog
      </button>
    </div>
  );
};

export default IndexPage;
