import React, { Component } from "react"
import { withRouter } from "react-router-dom"

import { USER } from "../../queries/user"
import { UPDATEUSER } from "../../mutations/user"
import { EMAILHISTORY } from "../../queries/email"

import ProfileMutationWrapper from "../profileMutationWrapper/ProfileMutationWrapper"

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetchingEmails: false,
      messages: []
    }
  }
  getMatchingEmails = () => {
    try {
      this.setState(
        () => ({
          fetchingEmails: true
        }),
        async () => {
          const {
            data: { emails: { messages } }
          } = await this.props.client.query({
            query: EMAILHISTORY,
            variables: {
              q: { email: this.state.email, includeSentEmails: true }
            }
          })
          let decoded = messages.map(message => ({ ...message.decoded }))
          this.setState({ messages: decoded, fetchingEmails: false })
        }
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  componentDidMount() {
    
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
