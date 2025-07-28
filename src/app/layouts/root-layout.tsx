import s from "./root-layout.module.scss"
import { Outlet } from "@tanstack/react-router";
import { Header } from "../../shared/ui/header/header.tsx";
import { AccountBar } from "../../features/auth/ui/account-bar/account-bar.tsx";

export const RootLayout = () => (
  <>
    <Header renderAccountBar={() => <AccountBar />} />
    <div className={s.container}>
      <Outlet />
    </div>
  </>
)