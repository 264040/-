export const LoadingReducer = (prevStateLoading = {
  loading: false
}, action) => { 
  switch (action.type) {
    case "LOADINGREDUCER":
      let newState = {...prevStateLoading}
      newState.loading = action.payload
      return  newState
  
    default:
      return prevStateLoading;
  } 
}