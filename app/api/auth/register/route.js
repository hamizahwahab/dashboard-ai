import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    // HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      username,
      password: hashedPassword // Save the hash, not the plain text!
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Registration failed", error: error.message }, { status: 500 });
  }
}