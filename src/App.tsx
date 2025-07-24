import { client } from "./shared/api/client.ts";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  return (
    <>
      <h2>Playlists</h2>
      <Playlists />
    </>
  );
};

export default App;

const Playlists = () => {
  const query = useQuery({
    queryKey: ["playlists"],
    queryFn: () => client.GET("/playlists"),
  });

  return (
    <ul>
      {query.data?.data?.data.map((playlist) => (
        <li key={playlist.id}>{playlist.attributes.title}</li>
      ))}
    </ul>
  );
};
