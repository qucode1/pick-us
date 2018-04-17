const { google } = require("googleapis")
const gmail = google.gmail("v1")

const key = require("../gsuiteServiceAccount.json")

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://mail.google.com/"],
  "yannick@qucode.eu"
)

exports.getMessageList = data =>
  new Promise((resolve, reject) => {
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
      } else {
        gmail.users.messages.list(
          {
            auth: jwtClient,
            userId: "yannick@qucode.eu",
            labelIds: "INBOX"
          },
          (err, messageList) => {
            if (err) {
              reject(err)
            }
            resolve(messageList)
          }
        )
      }
    })
  })
