import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Import the package

export async function POST(request: NextRequest) {
  try {
    // Accessing the request body
    const data = await request.json();

    // console.log(data);

    //compare credentials
    if (
      data.username !== "fda9392hf[+#${5667" ||
      data.password !== "fda93967fasd$#hf[+{5667"
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Credentials are valid, create a JWT
    const token = jwt.sign(
      { userId: data.username }, // Payload: you can include any user data you need
      process.env.JWT_SECRET!, // Use your JWT secret from environment variables
      { expiresIn: "1h" } // Set token expiration (e.g., 1 hour)
    );

    // Return the JWT in the response
    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse JSON, error: "+error },
      { status: 400 }
    );
  }
}
