export function creatSet(payload) {
  return {
    type: 'set',
    payload
  }
}

let idSeq = Date.now()


export function creatAdd(text) {
  // return {
  //   type: 'add',
  //   payload
  // }
  // 单纯state会导致添加后删除，仍然无法添加
  // return (dispatch, state) => {
  //   // 模拟异步效果
  //   setTimeout(() => {
  //     const { todos } = state
  //     if (!todos.find(todo => todo.text === text)) {
  //       dispatch({
  //         type: 'add',
  //         payload: {
  //           id: ++idSeq,
  //           text,
  //           complete: false
  //         }
  //       })
  //     } 
  //   }, 3000)
  // }
  return (dispatch, getState) => {
    
    // 模拟异步效果
    setTimeout(() => {
      const { todos } = getState()
      if (!todos.find(todo => todo.text === text)) {
        dispatch({
          type: 'add',
          payload: {
            id: ++idSeq,
            text,
            complete: false
          }
        })
      } 
    }, 3000)

  }
}


export function creatRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}

export function creatToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}