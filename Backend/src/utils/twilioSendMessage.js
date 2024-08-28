import twilio from "twilio"

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_ID;
const client = twilio(accountSid, authToken);

export const  sendMessage = async function createMessage(mobileNumber,body) {
  const message = await client.messages.create({
    from: `whatsapp:+14155238886`,
    body:body,
    to: `whatsapp:+91${mobileNumber}`,
  });

  console.log(message.sid);
}

