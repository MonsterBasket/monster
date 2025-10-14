import { Link } from "react-router-dom";
import axios from 'axios';
import Title from '../../components/Pages/Title.tsx'
import "./admin.css"
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../../App";

function Admin({handleLogout}){
  const [users, setUsers] = useState([])
  const [re, fresh] = useState([])

  useEffect(() => {loadUsers()}, [])

  function loadUsers(){
    axios.get(`${serverUrl}users`)
    .then(res => setUsers(res.data.users))
    .catch(err => console.log(err))
  }

  function toggleAdmin(user){
    user = { id: user.id, is_admin: !user.is_admin }
    axios.patch(`${serverUrl}user/admin`, {user}, {withCredentials: true})   
    .then(() => fresh([]))
  }

  function deleteUser(user){
    window.confirm(`Are you sure you want to delete ${user.username}?\nThis action is NOT reversible.`)
    axios.delete(`${serverUrl}user/${user.id}`)
    // this doesn't work, I'm not going to spend time trying to work out why right now
  }

  function displayUser(user){
    return <>
      <Link to={`user/${user.id}`}>{user.username}</Link>
      <div>{user.email}</div>
      <div onClick={() => toggleAdmin(user)}>{user.is_admin ? "yes" : "no"}</div>
      <div onClick={() => deleteUser(user)}>❌</div>
    </>
  }

  return <div id="adminPortal">
    <Link to="/select-character"><button>Back</button></Link>
    <button onClick={handleLogout}>Logout</button>
    <Link to="/admin/mapmaker"><button>Map Editor</button></Link>
    <Title size={0.7}/><br/><br/>
    <div id="userList">
      <div>Username</div><div>Email</div><div>Admin?</div><div>Delete</div>
      {users.map(user => <React.Fragment key={user.username}>{displayUser(user)}</React.Fragment>)}
    </div>
  </div>
}

export default Admin;