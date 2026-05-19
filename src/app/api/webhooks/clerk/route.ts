export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db/queries/users";

// Simplified webhook handler - in production, verify Clerk signature
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "user.created" || type === "user.updated") {
      const email =
        data.email_addresses?.[0]?.email_address ?? "";
      await getOrCreateUser(data.id, email);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
