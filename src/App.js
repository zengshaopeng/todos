import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import {
  creatAdd,
  creatRemove,
  creatSet,
  creatToggle 
} from './actions'

import reducer from './reducer'


// function combineReducers(reducers) {
//   return function reducer(state, action) {
//     const changed = {}
//     for (let key in reducers) {
//       changed[key] = reducers[key](state[key], action)
//     }
//     return {
//       ...state,
//       ...changed
//     }
//   }
// }

function bindActionCreators(actionCreators, dispatch) {
  const ret = {}
  for (let key in actionCreators) {
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      // 如果是addTodo,就是将参数传递进去addTodo中， actionCreators[key]就是creatAdd，即
      // creatAdd(payload) {
      //   return {
      //     type: 'add',
      //     payload
      //   }
      const action = actionCreator(...args) 
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

    addTodo(newText)

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

// 解决无法获取上下文的最新的todos和incremeentCount
let store = {
  todos: [],
  incrementCount: 0
}

function TodoList() {

  const [todos, setTodos] = useState([])

  const [incrementCount, setIncrementCount] = useState(0)

  useEffect(() => {
    Object.assign(store, {
      todos,
      incrementCount
    })
  }, [todos, incrementCount])

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

  // const reducer = {
  //   todos(state, action) {
  //     const { type, payload } = action
  //     switch(type) {
  //       case 'set':
  //         return payload
  //       case 'add':
  //         return [...state, payload]
  //       case 'remove':
  //         return state.filter(todo => {
  //           return todo.id !== payload
  //         }) 
  //       case 'toggle':
  //         return state.map(todo => {
  //           return todo.id === payload ? {
  //             ...todo,
  //             comlete: !todo.comlete
  //           } : todo
  //         })
  //       default:
  //     }
  //   },
  //   incrementCount(state, action) {
  //     const { type } = action
  //     switch(type) {
  //       case 'set':
  //       case 'add':
  //         return state + 1
  //       default:
  //     }
  //   }
  // }

  // function reducer(state, action) {
  //   const { type, payload } = action
  //   const { todos, incrementCount } = state
  //   switch(type) {
  //     case 'set':
  //       return {
  //         ...state,
  //         todos: payload,
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'add':
  //       return {
  //         ...state,
  //         todos: [...todos, payload],
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'remove':
  //       return {
  //        ...state,
  //        todos: todos.filter(todo => {
  //          return todo.id !== payload
  //        }) 
  //       }
  //     case 'toggle':
  //       return {
  //         ...state,
  //         todos: todos.map(todo => {
  //           return todo.id === payload ? {
  //             ...todo,
  //             comlete: !todo.comlete
  //           } : todo
  //         })
  //       }
  //     default:
  //   }
  //     return state
  // }

  // const reducer = combineReducers(reducers)


  // const dispatch = useCallback((action) => {

  //   console.log('action11111', action)
  //   const state = { todos, incrementCount }
  //   const setters = {
  //     todos: setTodos,
  //     incrementCount: setIncrementCount
  //   }

  //   if (typeof action === 'function') {

  //     action(dispatch, ()=> store);
  //     return
  //   }

  //   const newState = reducer(state, action)
  //   for (let key in newState) {
  //     setters[key](newState[key])
  //   }
  // }, [todos, incrementCount])

  // 引入异步后不需要usecallback
  const dispatch = (action) => {

    // const state = { todos, incrementCount }
    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount
    }

    if (typeof action === 'function') {

      action(dispatch, ()=> store);
      return
    }

    const newState = reducer(store, action)
    for (let key in newState) {
      setters[key](newState[key])
    }
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || [])
    dispatch(creatSet(todos))
    // setTodos(todos)
  }, [])

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
