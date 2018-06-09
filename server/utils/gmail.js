const { google } = require("googleapis")
const gmail = google.gmail("v1")
const drive = google.drive("v3")
const { Base64 } = require("js-base64")
const fs = require("fs")
const { promisify } = require("util")

const key = require("../gsuiteServiceAccount.json")
const gmailUserId = "yannick@qucode.eu"

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://mail.google.com/", "https://www.googleapis.com/auth/drive"],
  gmailUserId
)

const getMessageList = async (userId = gmailUserId, q = "", pageToken = 1) => {
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

const getMessage = async ({
  userId = gmailUserId,
  id = "",
  format = "full"
}) => {
  try {
    await jwtClient.authorize()
    return await gmail.users.messages.get({
      auth: jwtClient,
      userId,
      id
    })
  } catch (err) {
    throw err
  }
}

const getDecodedMessage = async ({
  userId = gmailUserId,
  id = "",
  format = "full"
}) => {
  try {
    const {
      data: { payload }
    } = await getMessage({ id, userId, format })
    const decoded = payload.headers.reduce((result, header) => {
      switch (true) {
        case header.name === "To":
        case header.name === "From":
        case header.name === "Date":
        case header.name === "Subject":
          result[header.name.toLowerCase()] = header.value
          break
        default:
          break
      }
      return result
    }, {})
    decoded.id = id
    decoded.message = Base64.decode(
      payload.mimeType === "text/plain"
        ? payload.body.data
        : payload.parts
          ? payload.parts.reduce((result, part) => {
              if (part.mimeType === "text/plain") {
                result = part.body.data
              } else if (part.mimeType.startsWith("multipart")) {
                result = part.parts.reduce((innerResult, innerPart) => {
                  if (innerPart.mimeType === "text/plain") {
                    innerResult = innerPart.body.data
                  }
                  return innerResult
                }, "")
              }
              return result
            }, "")
          : payload.mimeType.startsWith("text")
            ? payload.body.data
            : ""
    )
    decoded.attachments = payload.fileName
      ? payload.filename
      : payload.parts.filter(part => part.filename).map(part => ({
          fileName: part.filename,
          mimeType: part.mimeType,
          attachmentId: part.body.attachmentId
        }))
    return decoded
  } catch (err) {
    throw err
  }
}

const getAttachment = async ({
  attachmentId,
  messageId,
  userId = gmailUserId
}) => {
  try {
    await jwtClient.authorize()
    const attachment = gmail.users.messages.attachments.get({
      auth: jwtClient,
      id: attachmentId,
      messageId,
      userId
    })
    return attachment
  } catch (err) {
    throw err
  }
}

const uploadFile = async ({ data, fileName, mimeType, id }) => {
  try {
    const writeFile = promisify(fs.writeFile)
    const unlink = promisify(fs.unlink)
    await writeFile(`tempUploads/${fileName}`, data, "base64")
    const fileMetadata = {
      name: fileName
    }
    const media = {
      mimeType,
      body: fs.createReadStream(fileName)
    }
    await jwtClient.authorize()
    const file = await drive.files.create({
      auth: jwtClient,
      media,
      resource: fileMetadata,
      fields: "id"
    })
    unlink(`tempUploads/${fileName}`)
    return file
  } catch (err) {
    throw err
  }
}

const createString = email => `From: qucode info <${email.from}>
To: <${email.to}>
Subject: ${email.subject}

${email.message}`

const encodeString = string => Base64.encodeURI(string)

const sendMessage = async ({
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

module.exports = {
  getMessage,
  getMessageList,
  getDecodedMessage,
  getAttachment,
  sendMessage,
  uploadFile
}
