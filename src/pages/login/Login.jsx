import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './Login.css'
import { useLazyQuery } from 'react-apollo'
import { gql } from 'apollo-boost'

function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const query = gql`
  {
    user(name: "${username}", password: "${password}"){
      id
    }
  }
  `

  const [login, { called, data, loading }] = useLazyQuery(query, { onError: e => console.log(e) })
  if (called && !loading && typeof data != "undefined") {
    console.log("?")
    if (data.user != null) {
      localStorage.setItem("todoId", data.user.id)
      console.log("should be good")
      if (!redirect) setRedirect(true)
    }
  }

  return (
    <div className='loginContainer'>
      {redirect && <Redirect to='/todos' />}
      <h2>Log in</h2>
      <form onSubmit={e => {
        e.preventDefault()
        login()
      }}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login