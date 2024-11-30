'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './add-blog.module.css';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title && content) {
      const response = await fetch('/api/pages/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body: content }),  
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog added successfully!');
        router.push('/pages/index');  
      } else {
        alert(`Error: ${data.error}`);
      }
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
