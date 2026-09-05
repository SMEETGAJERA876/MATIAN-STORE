import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { generateToken, hashPassword, jsonResponse, TOKEN_NAME } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return jsonResponse({ error: "Name, email, and password are required" }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    // Public registration can only ever create CUSTOMER accounts — admin accounts
    // must be provisioned separately, never via a client-supplied role.
    const userRole: "ADMIN" | "CUSTOMER" = "CUSTOMER";

    const db = await connectToDatabase();

    if (db) {
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        return jsonResponse({ error: "An account with this email already exists" }, 400);
      }

      const hashedPassword = hashPassword(password);
      const newUser = await UserModel.create({
        id: `usr_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: userRole,
        status: "Active",
      });

      const tokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      };
      const token = generateToken(tokenPayload);

      const response = jsonResponse({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
        token,
        redirectTo: "/",
      });

      response.cookies.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    // Fallback Memory Store
    if (inMemoryStore.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return jsonResponse({ error: "An account with this email already exists" }, 400);
    }

    const memoryUser = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: hashPassword(password),
      role: userRole,
      createdAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "Active" as const,
    };
    inMemoryStore.users.push(memoryUser);

    const tokenPayload = {
      userId: memoryUser.id,
      email: memoryUser.email,
      role: memoryUser.role,
      name: memoryUser.name,
    };
    const token = generateToken(tokenPayload);

    const response = jsonResponse({
      success: true,
      user: {
        id: memoryUser.id,
        name: memoryUser.name,
        email: memoryUser.email,
        role: memoryUser.role,
        status: memoryUser.status,
        createdAt: memoryUser.createdAt,
      },
      token,
      redirectTo: "/",
    });

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Registration failed" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
