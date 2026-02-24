import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// FETCH Profile Data
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    const user = await User.findOne({ username }).select('-password'); // Exclude password for safety
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Fetch User Error:", error);
    return NextResponse.json({ message: "Error fetching profile" }, { status: 500 });
  }
}

// UPDATE Profile Data
export async function POST(req) {
  try {
    await dbConnect();
    const { username, bio } = await req.json();

    const user = await User.findOneAndUpdate(
      { username },
      { bio },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated!", bio: user.bio });
  } catch (error) {
    console.error("Update Profile Fail:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}