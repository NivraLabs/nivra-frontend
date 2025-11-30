import { JSX } from "react";
import { Link } from "react-router-dom";

export default function PageNotFound(): JSX.Element {
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Page not found</h1>
        <Link to="/">
          <button className="btn btn-primary">Go to home page</button>
        </Link>
      </div>

      <p className="muted">Unfortunately the page was not found.</p>
    </div>
  );
}
