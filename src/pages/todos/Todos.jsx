import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import './Todos.css'

function Todos(props) {
  const [redirect, setRedirect] = useState(false)
  const [todoTitle, setTodoTitle] = useState('')

  if (localStorage.getItem("todoId") == null || typeof localStorage.getItem("todoId") == "undefined") setRedirect(true)

  const todoQuery = gql`
  mutation{
    updateTodo(title: $title, completed: $completed){
      id
    }
  }
  `

  const addTodoQuery = gql`
  mutation{
    addTodo(title: "${todoTitle}", completed: false, author: "${localStorage.getItem("todoId")}"){
      id
    }
  }
  `

  const query = gql`
  {
    user(id: "${localStorage.getItem("todoId")}"){
      todos{
        title
        completed
      }
    }
  }
  `

  const [updateTodo, { data: addRes }] = useMutation(todoQuery)
  const [addTodo, { data: updateRes }] = useMutation(addTodoQuery)
  const { loading, data, refetch } = useQuery(query, { onError: e => console.log(e) })

  return (
    <div className='todoContainer'>
      <h1>My Todos</h1>
      {redirect && <Redirect to={{ pathname: '/', state: { fail: true } }} />}
      <form onSubmit={e => {
        e.preventDefault()
        addTodo({ variables: { title: todoTitle } })
        refetch()
        setTodoTitle('')
      }
      }>
        <input placeholder='Type your task here!' value={todoTitle} onChange={e => {
          setTodoTitle(e.target.value)
        }} />
      </form>
      {typeof data != "undefined" ? data.user.todos.map(todo => {
        return (<div className='todo' key={todo.title}>
          {todo.completed ? <input type='checkbox' checked onChange={e => {
            updateTodo({ variables: { title: todo.title, completed: e.target.value } })
            console.log(updateRes)
          }
          } /> : <input type='checkbox' onChange={null} />}
          <span>{todo.title}</span>
        </div>)
      }) : null}
    </div>
  )
}

export default Todos