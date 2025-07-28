import { useMeQuery } from "../../api/use-me-query.tsx";
import { CurrentUser } from "../current-user/current-user.tsx";
import { LoginButton } from "../logout-button/login-button.tsx";

export const AccountBar = () => {
  const { data, isPending } = useMeQuery();

  if (isPending) return <></>;

  return <div>{!data ? <LoginButton /> : <CurrentUser />}</div>;
};
