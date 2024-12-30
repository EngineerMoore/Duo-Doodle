import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  return (
    <>
      <h2>Welcome, {username}</h2>
      <h3>First Name</h3>
      <h3>Last Name</h3>
      <button>Play Game</button>
    </>
  )
}
export default Profile