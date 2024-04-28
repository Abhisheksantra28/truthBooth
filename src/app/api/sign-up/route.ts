import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectDB from "@/lib/connectDB";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await User.findOne({ username });

    if (existingUserVerifiedByUsername) {
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

    const existingUserByEmail = await User.findOne({ email });

    const verifyCodeOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists.",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCodeOtp;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCodeOtp,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCodeOtp
    );
    console.log("emailResponse: ", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message || "Error sending verification email",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User created successfully. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error signing up: ", error);
    return Response.json(
      {
        success: false,
        message: "Error signing up. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
