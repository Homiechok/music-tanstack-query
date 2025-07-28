import { Link } from "@tanstack/react-router";
import { useMeQuery } from "../../api/use-me-query.tsx";
import { LogoutButton } from "../login-button/logout-button.tsx";

export const CurrentUser = () => {
  const { data } = useMeQuery();

  return (
    <div>
      <Link to="/my-playlists" activeOptions={{ exact: true }}>
        {data?.login} <LogoutButton />
      </Link>
    </div>
  );
};
