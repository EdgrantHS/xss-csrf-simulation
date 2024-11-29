'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogPost from '../../components/BlogPost';
import styles from './index.module.css';

const IndexPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]); 
  const router = useRouter();

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    setBlogs(savedBlogs);
  }, []);

  const handleAddBlog = () => {
    router.push('/pages/add-blog');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    
    router.push('/pages/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Blog</h1>
      
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>

      <div className={styles.blogs}>
        {blogs.length === 0 ? (
          <p>No blogs added yet!</p>
        ) : (
          blogs.map((blog: any) => (
            <BlogPost key={blog.id} title={blog.title} content={blog.content} />
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
