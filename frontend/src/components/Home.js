import useAuth from "../hooks/useAuth";

function Home() {
  const { logout } = useAuth();

  return (
    <div data-testid="home">
      <div>Hit Home Route</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
