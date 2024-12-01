'use client';
import styles from './BlogPost.module.css';

const BlogPost = ({ title, content }: { title: string, content: string }) => {

  // const blog=`
  //  <p>This is some blog text. There could be <b>bold</b> elements as well as <i>italic</i> elements here! <p>
  //   <IMG SRC=# onmouseover="alert('xxs1')">
  //   <a href="javascript:alert('XSS2');">Click Me</a>
  // `
  return (
    <div className={styles.blogPost}>
      <h2 className={styles.blogPostTitle}>{title}</h2>

      {/* render unsafe html  */}
      {/* <p className={styles.blogPostContent}>{content}</p> */}
      <div
        className={styles.blogPostContent}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default BlogPost;
