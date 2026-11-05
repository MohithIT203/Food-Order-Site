import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <div style={{ width: "100%", position: "relative", textAlign: "center" }}>
        <h1>Page Not Found</h1>
        <Link to="/home">Home</Link>
      </div>
    </>
  );
}
export default NotFound;
