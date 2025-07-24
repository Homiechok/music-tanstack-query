import s from "./root-layout.module.scss"
import { Outlet } from "@tanstack/react-router";
import { Header } from "../../shared/ui/header.tsx";

export const RootLayout = () => (
  <>
    <Header renderAccountBar={() => <div>Account</div>} />
    <div className={s.container}>
      <Outlet />
    </div>
  </>
)