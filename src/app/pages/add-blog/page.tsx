'use client'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add-blog.module.css';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      const newBlog = { id: Date.now(), title, content };
      const existingBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
      existingBlogs.push(newBlog);
      localStorage.setItem('blogs', JSON.stringify(existingBlogs));  
      alert('Blog added successfully!');
      router.push('/pages/index'); 
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddBlog} className={styles.form}>
        <h1 className={styles.title}>Add Blog</h1>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
