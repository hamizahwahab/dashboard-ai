import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    // 1. Establish Database Connection
    await dbConnect();

    // 2. Parse the request body
    const body = await req.json();
    const { username, currentPassword, newPassword } = body;

    // 3. Validation: Check if fields are missing
    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // 4. Find the user in MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      );
    }

    // 5. Verify the current password matches the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password" }, 
        { status: 401 }
      );
    }

    // 6. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 7. Update and Save
    user.password = hashedPassword;
    await user.save();

    // 8. Return success
    return NextResponse.json(
      { message: "Password updated successfully!" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Change Password API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message }, 
      { status: 500 }
    );
  }
}