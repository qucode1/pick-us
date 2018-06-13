import React, { Component } from "react"

import { ME } from "../../queries/me"
import { UPDATEME } from "../../mutations/me"

import ProfileMutationWrapper from "../profileMutationWrapper/ProfileMutationWrapper"

class MyProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ProfileMutationWrapper
        mutation={UPDATEME}
        query={ME}
        queryVariables={{}}
        mutationTarget="me"
      />
    )
  }
}

export default MyProfile
