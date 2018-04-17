import React, { Component } from "react"

export const MyContext = React.createContext()
// const MyContext = React.createContext()

// export class MyProvider extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       error: {}
//     }
//     this.setError = this.setError.bind(this)
//   }
//   setError(e) {
//     this.setState({
//       error: e
//     })
//   }
//   render() {
//     return (
//       <MyContext.Provider
//         value={{
//           state: this.state,
//           setError: this.setError
//         }}
//       >
//         {this.props.children}
//       </MyContext.Provider>
//     )
//   }
// }
