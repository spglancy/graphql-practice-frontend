import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './Login.css'
import { useLazyQuery, useMutation } from 'react-apollo'
import { gql } from 'apollo-boost'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [newUser, setUser] = useState(false)
  const query = gql`
  {
    user(name: "${username}", password: "${password}"){
      id
    }
  }
  `

  const registerQuery = gql`
  mutation{
    addUser(name: "${username}", password: "${password}"){
      id
    }
  }
  `

  const [login, { called, data, loading }] = useLazyQuery(query, { onError: e => console.log(e) })
  if (called && !loading && typeof data != "undefined") {
    if (data.user != null) {
      localStorage.setItem("todoId", data.user.id)
      if (!redirect) setRedirect(true)
    }
  }

  const [register, { called: registerCalled, data: registerData, loading: registerLoading }] = useMutation(registerQuery)
  if (registerCalled && !registerLoading && typeof registerData != "undefined") {
    localStorage.setItem("todoId", registerData.addUser.id)
    if (!redirect) setRedirect(true)
  }
  return (
    <div className='loginContainer'>
      {redirect && <Redirect to='/todos' />}
      <h2>{newUser ? 'Register' : 'Log in'}</h2>
      <form onSubmit={e => {
        e.preventDefault()
        if (newUser) {
          register()
        } else {
          login()
        }
      }}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">{newUser ? 'Register' : 'Login'}</button>
        <span className='swap' onClick={() => setUser(!newUser)}>{newUser ? 'Already Have an Account?' : 'Dont Have an Account?'}</span>
      </form>
    </div>
  )
}

export default Login