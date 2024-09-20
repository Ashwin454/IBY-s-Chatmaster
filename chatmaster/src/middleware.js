import { NextResponse } from "next/server";

export async function middleware(request) {
    try {
        const isAuthenticated=request.cookies.get('is_auth')?.value
        // console.log("isAuthenticated:", isAuthenticated);
        if(!isAuthenticated){
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error: ", error);
        return NextResponse.next();    
    }
}

export const config={
    matcher: ['/chats', '/verify-email']
}