import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AuthLayout() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: 16 }}>
        <Outlet />
      </div>
    </>
  );
}
