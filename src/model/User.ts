import mongoose, { Schema, Document } from "mongoose";

export interface MessageInterface extends Document {
  content: String;
  createdAt: Date;
}

const MessageSchema: Schema<MessageInterface> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface UserInterface extends Document {
  username: String;
  email: String;
  password: String;
  verifyCode: String;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: MessageInterface[];
}

const UserSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    match: [
      /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
      "Please provide a valid email.",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  verifyCode: {
    type: String,
    required: [true, "Please provide a verification code."],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Please provide a verification code expiry date."],
  },
  isVerified: {
    type: Boolean,
    default: false,
  
  },
  isAcceptingMessage: {
      type: Boolean,
      default: true,
  },

  messages: [MessageSchema],

});



const User = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>("User", UserSchema);


export default User;

