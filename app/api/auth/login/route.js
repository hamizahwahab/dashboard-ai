import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    // 1. Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // 2. Compare the provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // 3. Login Successful! 
    // Usually, you would generate a JWT token here
    const token = "mock-jwt-token"; 

    return NextResponse.json({ 
      message: "Login successful",
      token,
      user: { username: user.username }
    });

  } catch (error) {
    return NextResponse.json({ message: "Login failed", error: error.message }, { status: 500 });
  }
}