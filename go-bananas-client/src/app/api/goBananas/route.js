import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuid } from "uuid";

import { db } from "../../../../firebase/db";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generateIdFromWord(word) {
  const alphanumericWord = word.replace(/[^a-zA-Z0-9]/g, "-");
  const randomCharacters = uuid().slice(0, 6);
  return `${alphanumericWord}-${randomCharacters}`;
}

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const word = params.get("word");

  if (!word)
    return NextResponse.json(
      { message: "Missing `word` parameter" },
      { status: 400 }
    );

  try {
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

    var aiResponse = chatCompletion.data.choices[0].message.content;
    var id = generateIdFromWord(word);

    return NextResponse.json(
      { id, word, response: aiResponse },
      { status: 200 }
    );
  } catch (error) {
    console.log("Server Error: ", error);
    return NextResponse.json(
      { error: `Chat completion failed: ${error}` },
      { status: 500 }
    );
  } finally {
    try {
      await setDoc(doc(db, "bananaResponses", id), {
        word,
        response: aiResponse,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
