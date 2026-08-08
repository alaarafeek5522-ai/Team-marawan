const API_ENABLED = false;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 🚫 API متوقف
    if (!API_ENABLED) {
      return Response.json(
        {
          ok: false,
          status: "disabled",
          title: "🚫 API DISABLED",
          message: "تم توقيف الـ API مؤقتًا",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        },
        {
          status: 503,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      );
    }

    // هذا الجزء لن يعمل طالما API_ENABLED = false
    if (url.pathname !== "/renew") {
      return Response.json(
        {
          ok: false,
          error: "Endpoint not found",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
        },
        { status: 404 }
      );
    }

    if (request.method !== "POST") {
      return Response.json(
        {
          ok: false,
          error: "Method Not Allowed",
          message: "Use POST /renew",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
        },
        { status: 405 }
      );
    }

    return Response.json(
      {
        ok: false,
        status: "disabled",
        message: "API is currently disabled",
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
      },
      { status: 503 }
    );
  }
};
