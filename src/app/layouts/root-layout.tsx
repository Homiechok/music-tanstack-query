import s from "./root-layout.module.scss"
import { Outlet } from "@tanstack/react-router";
import { Header } from "../../shared/ui/header/header.tsx";
import { LoginButton } from "../../features/auth/ui/login-button/login-button.tsx";

export const RootLayout = () => (
  <>
    <Header renderAccountBar={() => <LoginButton /> } />
    <div className={s.container}>
      <Outlet />
    </div>
  </>
)