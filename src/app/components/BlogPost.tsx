import styles from './BlogPost.module.css';

const BlogPost = ({ title, content }: { title: string, content: string }) => {
  return (
    <div className={styles.blogPost}>
      <h2 className={styles.blogPostTitle}>{title}</h2>
      <p className={styles.blogPostContent}>{content}</p>
    </div>
  );
};

export default BlogPost;
