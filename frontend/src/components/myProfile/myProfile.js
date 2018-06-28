import React from "react"

import { ME } from "../../queries/me"
import { UPDATEME } from "../../mutations/me"

import ProfileMutationWrapper from "../profileMutationWrapper/ProfileMutationWrapper"

const MyProfile = () => {
  return (
    <ProfileMutationWrapper
      mutation={UPDATEME}
      query={ME}
      queryVariables={{}}
      mutationTarget="me"
    />
  )
}

export default MyProfile
