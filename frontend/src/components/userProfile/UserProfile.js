import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { withApollo } from "react-apollo"

import { USER } from "../../queries/user"
import { UPDATEUSER } from "../../mutations/user"
import { EMAILHISTORY } from "../../queries/email"

import ProfileMutationWrapper from "../profileMutationWrapper/ProfileMutationWrapper"

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetchingNewEmails: false,
      updatedMessages: []
    }
  }
  getNewEmails = ({ input, oldMessages, id }) => {
    try {
      this.setState(
        () => ({
          fetchingNewEmails: true
        }),
        async () => {
          const {
            data: { emails: { messages } }
          } = await this.props.client.query({
            query: EMAILHISTORY,
            variables: {
              q: { email: input.email, includeSentEmails: true }
            }
          })
          const decoded = messages.map(message => ({ ...message.decoded }))
          const newMessages = decoded.filter(
            newMessage =>
              Date.parse(newMessage.date) > Date.parse(oldMessages[0].date)
          )
          if (newMessages.length) {
            const updatedMessages = [...newMessages, ...oldMessages]
            this.setState({
              updatedMessages,
              fetchingNewEmails: false
            })
            this.saveNewEmails(id, input, updatedMessages)
          }
        }
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  saveNewEmails = async (id, input, messages) => {
    try {
      const savedUser = await this.props.client.mutate({
        mutation: UPDATEUSER,
        variables: {
          id,
          input,
          messages: messages.map(message => {
            const { __typename, ...rest } = message
            return rest
          })
        }
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  componentDidMount() {}
  render() {
    return (
      <ProfileMutationWrapper
        mutation={UPDATEUSER}
        query={USER}
        queryVariables={{ id: this.props.match.params.id }}
        mutationTarget="user"
        updatedMessages={this.state.updatedMessages}
        fetchingNewEmails={this.state.fetchingEmails}
        getNewEmails={this.getNewEmails}
      />
    )
  }
}

export default withRouter(withApollo(UserProfile))
