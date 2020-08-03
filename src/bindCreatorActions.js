import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import {
  creatAdd,
  creatRemove,
  creatSet,
  creatToggle 
} from './actions'

let idSeq = Date.now()

function bindActionCreators(actionCreators, dispatch) {
  const ret = {}
  console.log('actionCreatorsssss', actionCreators)
  for (let key in actionCreators) {
    console.log('key', key)
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      // 如果是addTodo,就是将参数传递进去addTodo中， actionCreators[key]就是creatAdd，即
      // creatAdd(payload) {
      //   return {
      //     type: 'add',
      //     payload
      //   }
      console.log('actionCreator', actionCreator)
      const action = actionCreator(...args) 
      console.log('action', action)
    // 等同于 dispatch({
    //   type: 'add',
    //   payload: {
    //     id: ++idSeq,
    //     text: newText,
    //     comlete: false
    //   }
    // })
      dispatch(action)
    }
  }
  console.log('ret', ret)
  return ret
}

function Controll(props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) {
      return
    }

    // addTodo({
    //   id: ++idSeq,
    //   text: newText,
    //   comlete: false
    // })
    
    // dispatch({
    //   type: 'add',
    //   payload: {
    //     id: ++idSeq,
    //     text: newText,
    //     comlete: false
    //   }
    // })

    addTodo({
        id: ++idSeq,
        text: newText,
        comlete: false
    })

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
  }, removeTodo, toggleTodo } = props

  const onChange = () => {
    // toggleTodo(id)
    // dispatch({
    //   type: 'toggle',
    //   payload: id
    // })
    // dispatch(creatToggle(id))
    toggleTodo(id)
  }

  const onRemove = () => {
    // removeTodo(id)
    // dispatch({
    //   type: 'remove',
    //   payload: id
    // })
    // dispatch(creatRemove(id))
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
  // const { todos, toggleTodo, removeTodo } = props
  // const { todos, dispatch } = props
  const { todos, toggleTodo, removeTodo } = props
  return (
    <ul>
      {
        todos.map(todo => {
          return <TodoItem key={todo.id } todo={todo} removeTodo={removeTodo} toggleTodo={toggleTodo}></TodoItem>
        })
      }
    </ul>
  )
}

const LS_KEY = 'LIST'

function TodoList() {

  const [todos, setTodos] = useState([])

  // const addTodo = (todo) => {
  //   setTodos(todos => [...todos, todo])
  // }

  // const removeTodo = (id) => {
  //   setTodos(todos => todos.filter(todo => {
  //     return todo.id !== id
  //   }))
  // }

  // const toggleTodo = (id) => {
  //   setTodos(todos => todos.map(todo => {
  //     return todo.id === id ? {
  //       ...todo,
  //       comlete: !todo.comlete
  //     } : todo 
  //   }))
  // }

  const dispatch = useCallback((action) => {
    const { type, payload } = action
    switch(type) {
      case 'set': 
        setTodos(payload)
        break
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'remove': 
      setTodos(todos => todos.filter(todo => {
        return todo.id !== payload
      }))
        break
      case 'toggle':
        setTodos(todos => todos.map(todo => {
          return todo.id === payload ? {
            ...todo,
            comlete: !todo.comlete
          } : todo 
        }))
        break;
      default: 
    }
  }, [])

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || [])
    dispatch(creatSet(todos))
    // setTodos(todos)
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])



  return ( 
    <div className='todo-list'>
      {/* <Controll addTodo={addTodo}></Controll>
      <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos}></Todos> */}
      <Controll  {
          ...bindActionCreators({
            addTodo: creatAdd
          }, dispatch)
        }>
      </Controll>
      {/* <Todos dispatch={dispatch} todos={todos}></Todos> */}
      <Todos {
        ...bindActionCreators({
          removeTodo: creatRemove,
          toggleTodo: creatToggle
        }, dispatch)
      } todos={todos}></Todos>
    </div>
  )
}

export default TodoList;
