const { google } = require("googleapis")
const gmail = google.gmail("v1")
const { Base64 } = require("js-base64")

const key = require("../gsuiteServiceAccount.json")
const gmailUserId = "yannick@qucode.eu"

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://mail.google.com/"],
  gmailUserId
)

exports.getMessageList = async (
  userId = "yannick@qucode.eu",
  q = "",
  pageToken = 1
) => {
  try {
    await jwtClient.authorize()
    return await gmail.users.messages.list({
      auth: jwtClient,
      userId,
      // labelIds: "INBOX",
      q
    })
  } catch (err) {
    throw err
  }
}

const createString = email => `From: qucode info <${email.from}>
To: <${email.to}>
Subject: ${email.subject}

${email.message}`

const encodeString = string => Base64.encodeURI(string)

exports.sendMessage = async ({
  from = "info@qucode.eu",
  to = "quinius_789@yahoo.de",
  subject = "testing gmail api",
  message = "Hi. This is a test message from the node server."
} = {}) => {
  try {
    const email = {
      from,
      to,
      subject,
      message
    }
    const raw = Base64.encodeURI(createString(email))

    await jwtClient.authorize()
    return await gmail.users.messages.send({
      auth: jwtClient,
      userId: userId,
      resource: {
        raw: raw
      }
    })
  } catch (err) {
    throw err
  }
}
