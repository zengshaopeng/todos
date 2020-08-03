import React, { useState, useEffect, useRef } from 'react';
import './App.css';

let idSeq = Date.now()

function Controll(props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) {
      return
    }

    addTodo({
      id: ++idSeq,
      text: newText,
      comlete: false
    }    ) 

    inputRef.current.value = ''
  }

  return (
    <div className='control'>
      <h1>
        todos
      </h1>
      <form onSubmit={onSubmit}>
        <input ref={inputRef} type='text' className='new-todo' placeholder="what needs to be done"></input>
      </form>
    </div> 
  )
}

function TodoItem(props) {
  const { todo: {
    id, text, comlete
  }, toggleTodo, removeTodo } = props

  const onChange = () => {
    toggleTodo(id)
  }

  const onRemove = () => {
    removeTodo(id)
  }
  return (
    <li className='todo-item'>
      <input type='checkbox' onChange={ onChange } checked={comlete}></input>
      <label className={comlete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>X</button>
    </li>
  )
}

function Todos(props ) {
  const { todos, toggleTodo, removeTodo } = props
  return (
    <ul>
      {
        todos.map(todo => {
          return <TodoItem key={todo.id } todo={todo} toggleTodo={toggleTodo} removeTodo={removeTodo}></TodoItem>
        })
      }
    </ul>
  )
}

const LS_KEY = 'LIST'

function TodoList() {

  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos(todos => [...todos, todo])
  }

  const removeTodo = (id) => {
    setTodos(todos => todos.filter(todo => {
      return todo.id !== id
    }))
  }

  const toggleTodo = (id) => {
    setTodos(todos => todos.map(todo => {
      return todo.id === id ? {
        ...todo,
        comlete: !todo.comlete
      } : todo 
    }))
  }
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || [])
    setTodos(todos)
  }, [])
  
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])



  return ( 
    <div className='todo-list'>
      <Controll addTodo={addTodo}></Controll>
      <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos}></Todos>
    </div>
  )
}

export default TodoList;
