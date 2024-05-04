import connectDB from "@/lib/connectDB";
import User from "@/model/User";
import { MessageInterface } from "@/model/User";

export async function POST(request: Request) {
  await connectDB();

  const { username, content } = await request.json();
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as MessageInterface);

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to send the message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send the message",
      },
      {
        status: 500,
      }
    );
  }
}
