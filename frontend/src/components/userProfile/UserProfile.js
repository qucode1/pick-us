import React, { Component } from "react"
import { withRouter } from "react-router-dom"

import { USER } from "../../queries/user"
import { UPDATEUSER } from "../../mutations/user"

import ProfileMutationWrapper from "../profileMutationWrapper/ProfileMutationWrapper"

class UserProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ProfileMutationWrapper
        mutation={UPDATEUSER}
        query={USER}
        queryVariables={{ id: this.props.match.params.id }}
        mutationTarget="user"
      />
    )
  }
}

export default withRouter(UserProfile)
