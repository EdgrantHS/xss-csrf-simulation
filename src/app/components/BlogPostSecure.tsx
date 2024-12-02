'use client';
import { useEffect, useState } from 'react';
import styles from './BlogPost.module.css';
import DOMPurify from 'dompurify';

const BlogPostSecure = ({ title, content }: { title: string, content: string }) => {

  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  const allowedTags = ['b', 'i', 'em', 'strong'];

  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
    });
  };


  useEffect(() => {
    setSanitizedContent(sanitizeHtml(content));
  }, [content]);

  // const blog=`
  //  <p>This is some blog text. There could be <b>bold</b> elements as well as <i>italic</i> elements here! <p>
  //   <IMG SRC=# onmouseover="alert('xxs1')">
  //   <a href="javascript:alert('XSS2');">Click Me</a>

  return (
    <div className={styles.blogPost}>
      <h2 className={styles.blogPostTitle}>{title}</h2>

      {/* render unsafe html  */}
      <p className={styles.blogPostContent}>{content}</p>
      <div
        className={styles.blogPostContent}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      {/* <div
        className={styles.blogPostContent}
        dangerouslySetInnerHTML={{ __html: content }}
      /> */}
    </div>
  );
};

export default BlogPostSecure;
 