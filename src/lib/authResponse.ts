import { NextResponse } from "next/server";

export function jsonResponse(data: unknown, status = 200, headers = {}) {
  return NextResponse.json(data, {
    status,
    headers,
  });
}
