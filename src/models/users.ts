import { Schema, model, Document, Model } from "mongoose";
import { randomBytes, createHmac } from "crypto";
import { generateToken } from "../services/auth.service";

// Interface for the user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  likedMovies: Schema.Types.ObjectId[];
  salt?: string;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the static method
interface IUserModel extends Model<IUser> {
  matchPasswordAndGenerateToken: (
    email: string,
    password: string
  ) => Promise<string>;
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    likedMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    salt: { type: String },
    profilePic: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg",
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// Static method to match password and generate token
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email: string, password: string) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User doesn't exist");

    const hashedPassword = createHmac("sha256", user.salt!)
      .update(password)
      .digest("hex");
    if (user.password !== hashedPassword) throw new Error("Wrong password");

    return generateToken(user);
  }
);

// Create and export the model
const Users = model<IUser, IUserModel>("User", userSchema);
export default Users;
