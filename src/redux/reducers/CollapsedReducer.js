export const CollApsedReducer = (prevState = {
  collapsed: false
}, action) => { 
  switch (action.type) {
    case "change_collapsed":
      let newState = {...prevState}
      newState.collapsed = !newState.collapsed
      return  newState
  
    default:
      return prevState;
  } 
}