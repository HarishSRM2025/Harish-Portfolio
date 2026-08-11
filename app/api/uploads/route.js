import { NextResponse } from "next/server";
import { upload, runMiddleware, toNodeRequest } from "@/lib/multer-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const nodeReq = toNodeRequest(request);
    const result = await runMiddleware(
      nodeReq,
      {},
      upload.single("file")
    );
    const file = nodeReq.file || result?.file;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    return NextResponse.json({
      path: `/uploads/${file.filename}`,
      filename: file.originalname,
      mimetype: file.mimetype
    });
  } catch (err) {
    console.error("Upload POST error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
