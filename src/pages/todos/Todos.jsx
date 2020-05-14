import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import './Todos.css'

function Todos(props) {
  const [redirect, setRedirect] = useState(false)
  const [todoTitle, setTodoTitle] = useState('')
  const [rerender, setRerender] = useState('')

  if (localStorage.getItem("todoId") == null || typeof localStorage.getItem("todoId") == "undefined") setRedirect(true)

  const todoQuery = gql`
  mutation($title: String!, $completed: Boolean!){
    updateTodo(title: $title, completed: $completed){
      completed
    }
  }
  `

  const addTodoQuery = gql`
  mutation($title: String!, $id: ID){
    addTodo(title: $title, completed: false, author: $id){
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

  const deleteTodoQuery = gql`
  mutation($title: String!){
    deleteTodo(title: $title){
      id
    }
  }
  `

  const [updateTodo, { data: addRes, loading: updateLoading }] = useMutation(todoQuery)
  const [addTodo, { data: updateRes, loading: addLoading }] = useMutation(addTodoQuery)
  const [deleteTodo, { data: deleteRes, loading: deleteLoading }] = useMutation(deleteTodoQuery)
  const { loading, data, refetch } = useQuery(query)

  return (
    <div className='todoContainer'>
      <h1>My Todos</h1>
      {redirect && <Redirect to={{ pathname: '/', state: { fail: true } }} />}
      <form onSubmit={e => {
        e.preventDefault()
        addTodo({ variables: { title: todoTitle, id: localStorage.getItem("todoId") } })
        setTodoTitle('')
        if (!addLoading) refetch()
      }
      }>
        <input placeholder='Type your task here!' value={todoTitle} onChange={e => {
          setTodoTitle(e.target.value)
        }} />
      </form>
      {typeof data != "undefined" ? data.user.todos.map(todo => {
        return (<div className='todo' key={todo.title}>
          <input type='checkbox' checked={todo.completed} onChange={e => {
            updateTodo({ variables: { title: todo.title, completed: !todo.completed } })
            if (!updateLoading) {
              refetch()
            }
          }
          } />
          <span>{todo.title}</span>
          {todo.completed && <button onClick={() => {
            deleteTodo({ variables: { title: todo.title } })
            if (!deleteLoading) refetch()
          }}>Remove</button>}
        </div>)
      }) : null}
    </div>
  )
}

export default Todos