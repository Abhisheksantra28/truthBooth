import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/connectDB";
import User from "@/model/User";
// import { User as NextUser } from "next-auth";

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "userId not found",
      },
      {
        status: 400,
      }
    );
  }

  const { acceptMesages } = await request.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMesages,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update the user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update the user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update the user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user?._id;
  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "userId not found",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to find the user",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user status fetched successfully",
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error is fetching message acceptance status", error);
    return Response.json(
      {
        success: false,
        message: "Error is fetching message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
