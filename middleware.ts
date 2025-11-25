import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname !== "/") {
    return NextResponse.next();
  }

  const cityId = searchParams.get("cityId");

  if (cityId) {
    return NextResponse.next();
  }

  const defaultCityId = "94";

  const url = request.nextUrl.clone();
  url.searchParams.set("cityId", defaultCityId);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
