import connectDB from "@/lib/connectDB";
import User from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result); //todo:remove

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter",
        },

        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists.",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error in Checking username. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
