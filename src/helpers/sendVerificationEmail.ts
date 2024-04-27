import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {

    const emailBody = VerificationEmail({ username, otp });

  try {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'truthbooth - Verify your account',
        react: emailBody,
      });

    return {
        success: true,
        message: "Verification email sent successfully",
    };
  } catch (error) {
    console.log("Error sending verification email: ", error);
    return {
        success: false,
        message: "Error sending verification email",
    };
  }

}
