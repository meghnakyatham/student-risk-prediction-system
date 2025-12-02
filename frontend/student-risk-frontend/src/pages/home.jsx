export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-5">
      <h1 style={{color:"#800020"}}>Welcome {user?.name}</h1>
      <p>Your role: {user?.role}</p>
    </div>
  );
}
