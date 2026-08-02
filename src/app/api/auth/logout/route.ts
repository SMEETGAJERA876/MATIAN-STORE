import { jsonResponse, TOKEN_NAME } from "@/lib/auth";

export async function POST() {
  const response = jsonResponse({ success: true, message: "Logged out successfully" });
  response.cookies.delete(TOKEN_NAME);
  return response;
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
