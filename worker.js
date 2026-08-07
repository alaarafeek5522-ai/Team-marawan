export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/renew") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch(
        "https://apis-babacoder.online:8443/renew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const result = await response.json();

      return Response.json({
        ...result,
        developer: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
        powered_by: "Team Maro API"
      }, {
        status: response.status
      });

    } catch (error) {
      return Response.json({
        ok: false,
        error: "API Error",
        developer: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
      }, {
        status: 500
      });
    }
  }
};
