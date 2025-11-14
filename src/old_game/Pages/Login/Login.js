import { useState } from "react";
import login from "../../utils/login/login"
import './home.css';
import { Link } from "react-router-dom";
import Title from '../../components/Pages/Title.tsx'
import Menu from '../../../components/Menu.js'

function Login({ handleLogin, handleLogout }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    loginError: "",
  })

  function handleChange(e) {
    if (e.target.name === "username") setForm({ ...form, [e.target.name]: e.target.value, usernameError: "" })
    if (e.target.name === "password") setForm({ ...form, [e.target.name]: e.target.value, passwordError: "" })
  }


  return <div id="gameHome">
    <Title size={2} />
    <Menu />
    <div id="homeContainer">
      <h3>Login</h3>
      <div>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} onKeyDown={e => { if (e.code === "Enter") login(form, setForm, handleLogin) }} value={form.username} /><br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} onKeyDown={e => { if (e.code === "Enter") login(form, setForm, handleLogin) }} value={form.password} /><br /><br />
        <button className="bigButton" onClick={() => login(form, setForm, handleLogin)}>Login</button><br />
        <span>{form.loginError}</span><br /><br />
      </div>
      <Link to="/playOld/signup"><button className="littleButton">No Account?</button></Link>
      <div className="loginCover"><div>OFF-LINE<br/>Please check back later!</div></div>
    </div>
  </div>
}

export default Login;