import axios from 'axios';
import { serverUrl } from '../../../App';

function login(form, setForm, handleLogin){
  setForm({...form, loginError:""})
  if(form.username && form.password){
  axios.post(`${serverUrl}login`, {form}, {withCredentials: true})
    .then(res => {
      if(res.data.logged_in) {
        handleLogin(res)
      }
      else setForm({...form, loginError: res.data.errors})
    })
    .catch(err => console.log('login error:', err))
  }
  else if(form.username && !form.password){
    setForm({...form, loginError:"Please Enter a Password"})
  }
  else{
    setForm({...form, loginError:"Please Enter a Username"})
  }
}

export default login;



