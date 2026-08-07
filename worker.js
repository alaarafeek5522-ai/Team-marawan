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

      return new Response(await response.text(), {
        status: response.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      return Response.json(
        {
          success: false,
          error: error.toString()
        },
        { status: 500 }
      );
    }
  }
};
