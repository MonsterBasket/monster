import { useState } from "react";
import axios from 'axios';
import login from "../../utils/login/login.js"
import Title from '../../components/Pages/Title.tsx'
import '../Login/home.css';
import { serverUrl } from "../../App";
import { Link } from "react-router-dom";

function Signup({ handleLogin }) {

  const [form, setForm] = useState({
    username: "",
    usernameError: "",
    email: "",
    emailError: "",
    password: "",
    password_confirmation: "",
    password1Error: "",
    password2Error: ""
  })

  function signup() {
    const user = {
      username: form.username,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    }

    if (form.username && form.email && form.password && form.password_confirmation) {
      axios.post(`${serverUrl}users`, { user }, { withCredentials: true })
        .then(json => {
          login(user, setForm, handleLogin)
          // this.redirect("/select-character")
        })
        .catch(err => console.log(err));
    }
    else {
      alert("please enter all fields correctly")
    }
  }

  function handleChange(e) {
    // I should do some sanitization, but I'll probably use a library
    if (e.target.name === "username") setForm({ ...form, [e.target.name]: e.target.value, usernameError: "" })
    if (e.target.name === "email") setForm({ ...form, [e.target.name]: e.target.value, emailError: "" })
    else if (e.target.name === "password") {
      if (e.target.value === "" || e.target.value.length > 5) { //6 digit passwords are enough since it's a fake website :D
        setForm({ ...form, [e.target.name]: e.target.value, password1Error: "" })
      }
      else {
        setForm({ ...form, [e.target.name]: e.target.value, password1Error: "❌ Passwords must be at least 6 digits" })
      }
    }
    else if (e.target.name === "password_confirmation") {
      if (e.target.value.length < 6) {
        setForm({ ...form, [e.target.name]: e.target.value, password2Error: "" })
      }
      else if (e.target.value === form.password) {
        setForm({ ...form, [e.target.name]: e.target.value, password2Error: "✅ Passwords match!" })
      }
      else {
        setForm({ ...form, [e.target.name]: e.target.value, password2Error: "❌ Passwords don't match!" })
      }
    }
  }


  return <div id="signup">
    <Title size={1} />
    <div>
      <h3>Create Account</h3>
      <div>
        <input type="text" name="username" placeholder="Choose a Username" onChange={handleChange} value={form.username} /><br />
        <span>{form.usernameError}</span><br />
        <input type="text" name="email" placeholder="Email" onChange={handleChange} value={form.email} /><br />
        <span>{form.emailError}</span><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} /><br />
        <span>{form.password1Error}</span><br />
        <input type="password" name="password_confirmation" placeholder="Repeat Password" onChange={handleChange} onKeyDown={e => { if (e.code === "Enter") signup() }} value={form.password_confirmation}></input><br />
        <span>{form.password2Error}</span><br />
        <button className="bigButton" onClick={signup}>Sign-Up</button><br /><br /><br />
      </div>
      <Link to="/login"><button className="littleButton">Back to login</button></Link>
    </div>
  </div>
}

export default Signup;