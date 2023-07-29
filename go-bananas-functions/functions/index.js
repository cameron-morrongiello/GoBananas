const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Firestore } = require("firebase-admin/firestore");
const { Configuration, OpenAIApi } = require("openai");
const uuid = require("uuid");
require("dotenv").config();

admin.initializeApp();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generateIdFromWord(word) {
  const alphanumericWord = word.replace(/[^a-zA-Z0-9]/g, "-");
  const randomCharacters = uuid.v4().substr(0, 6);
  return `${alphanumericWord}-${randomCharacters}`;
}

exports.goBananas = functions.https.onRequest(async (req, res) => {
  try {
    const word = req.query.word;

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            // eslint-disable-next-line max-len
            "Explain the following concept as if I was a kindergartener using bananas. Reply in a funny and consise manner.",
        },
        {
          role: "user",
          content: word,
        },
      ],
    });

    const aiResponse = chatCompletion.data.choices[0].message.content;

    const id = generateIdFromWord(word);

    res.status(200).json({
      id,
      word,
      response: aiResponse,
    });

    // Save to database
    try {
      await admin.firestore().collection("bananaResponses").doc(id).set({
        word,
        response: aiResponse,
        createdAt: Firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Something went wrong.");
  }
});
