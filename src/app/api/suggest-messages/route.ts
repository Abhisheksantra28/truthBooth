import { MistralStream, StreamingTextResponse } from "ai";

import MistralClient from "@mistralai/mistralai";

const mistral = new MistralClient(process.env.MISTRAL_API_KEY || "");

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    // const { messages } = await req.json();

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead on universal theme that encourage friendly interaction. For example, your output should be structed like this: 'What's a hobby you have recently started?||If you could travel anywhere in the world, where would you go?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Ask Mistral for a streaming completion given the prompt
    const response = mistral.chatStream({
      model: "mistral-small",
      maxTokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    // Convert the response into a friendly text-stream. The Mistral client responses are
    // compatible with the Vercel AI SDK MistralStream adapter.
    const stream = MistralStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("An un expected error occurred", error);
    throw error;
  }
}

// reference to the Mistral AI
// https://sdk.vercel.ai/providers/legacy-providers/mistral
