import { Playlists } from "../features/playlists/playlists.tsx";
import { useMeQuery } from "../features/auth/api/use-me-query.tsx";
import { Navigate } from "@tanstack/react-router";

export default function MyPlaylistsPage() {
  const { data, isPending } = useMeQuery();

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <h2>My Playlists</h2>
      <Playlists userId={data.userId} />
    </div>
  );
}
