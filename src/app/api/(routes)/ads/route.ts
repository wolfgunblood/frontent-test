import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { adSchema, adSchemaDB, type ZodAdDB } from "~/lib/schema";

interface Ad {
  type: "AUTO" | "STATIC" | "AB";
  timestamp: number;
}

export async function POST(req: Request) {
  try {
    const ads = (await req.json()) as Ad;

    // console.log(ads);
    const validatedAds = adSchema.parse(ads);

    const createdAd = await db.ads.create({
      data: validatedAds,
    });

    return new NextResponse(JSON.stringify(createdAd), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[ADS]", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const result = await db.ads.findMany();

    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("[ADS] Fetching Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const marker = (await req.json()) as ZodAdDB;

    const validatedMarker = adSchemaDB.parse(marker);

    await db.ads.delete({
      where: {
        id: validatedMarker.id,
      },
    });
    const markers = await db.ads.findMany();

    return new NextResponse(JSON.stringify(markers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
