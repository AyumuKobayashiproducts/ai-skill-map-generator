import { ImageResponse } from "next/og";

// OGP画像生成（動的生成）
export const runtime = "edge";
export const alt = "AI Skill Map Generator - 職務経歴から転職準備を60秒で完成";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* 背景の装飾 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* アイコン */}
          <div
            style={{
              fontSize: "120px",
              marginBottom: "30px",
              display: "flex",
              gap: "20px",
            }}
          >
            🗺️✨💼
          </div>

          {/* タイトル */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 20px 0",
              lineHeight: 1.2,
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            AI Skill Map Generator
          </h1>

          {/* サブタイトル */}
          <p
            style={{
              fontSize: "36px",
              color: "rgba(255, 255, 255, 0.95)",
              margin: "0 0 40px 0",
              maxWidth: "900px",
              lineHeight: 1.4,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            職務経歴を入力するだけで
            <br />
            転職準備がまるっと完成
          </p>

          {/* 特徴 */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "20px",
            }}
          >
            {["⚡ 60秒で完了", "🔒 完全無料", "🎯 AI診断"].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  padding: "16px 32px",
                  borderRadius: "16px",
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "white",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}








