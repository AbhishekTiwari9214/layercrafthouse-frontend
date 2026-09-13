import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080808",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 148,
            height: 148,
            borderRadius: 74,
            border: "3px solid #E8D5B0",
            color: "#E8D5B0",
            fontSize: 58,
            fontFamily: "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.06em",
            fontWeight: 500,
          }}
        >
          LC
        </div>
      </div>
    ),
    { ...size },
  );
}
