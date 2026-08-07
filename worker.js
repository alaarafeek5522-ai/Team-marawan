export default {
  async fetch(request) {
    const url = new URL(request.url);

    // الصفحة الرئيسية
    if (url.pathname === "/") {
      return Response.json({
        ok: true,
        api: "Renew API",
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
        version: "1.0.0",
        endpoint: "/renew"
      });
    }

    // Endpoint التجديد فقط
    if (url.pathname !== "/renew") {
      return Response.json({
        ok: false,
        error: "Endpoint not found",
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
      }, { status: 404 });
    }

    // يجب أن يكون POST
    if (request.method !== "POST") {
      return Response.json({
        ok: false,
        error: "Method Not Allowed",
        message: "Use POST /renew",
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐"
      }, { status: 405 });
    }

    try {
      // قراءة البيانات
      const body = await request.json();

      if (!body.email || !body.password) {
        return Response.json({
          ok: false,
          status: "error",
          message: "البريد الإلكتروني وكلمة المرور مطلوبان",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        }, { status: 400 });
      }

      // إرسال الطلب إلى الـ API الأصلي
      const response = await fetch(
        "https://apis-babacoder.online:8443/renew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: body.email,
            password: body.password
          })
        }
      );

      // قراءة الرد
      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        return Response.json({
          ok: false,
          status: "error",
          message: "الـ API الأصلي أرسل استجابة غير صالحة",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        }, { status: 502 });
      }

      // ==========================================
      // حالة تسجيل الدخول الفاشل
      // ==========================================
      if (
        result.ok === false &&
        typeof result.error === "string" &&
        result.error.toLowerCase().includes("wrong email or password")
      ) {
        return Response.json({
          ok: false,
          status: "login_failed",
          message: "بيانات تسجيل الدخول غير صحيحة",
          details: "البريد الإلكتروني أو كلمة المرور خاطئة",
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        }, { status: 400 });
      }

      // ==========================================
      // استخراج نتيجة التجديد
      // ==========================================
      const renewResult =
        typeof result.result === "string"
          ? result.result
          : "";

      // ==========================================
      // التجديد غير متاح حاليًا
      // ==========================================
      if (
        renewResult.includes("You can't renew your server yet")
      ) {
        let renewDate = null;
        let remaining = null;

        // استخراج التاريخ
        const dateMatch = renewResult.match(
          /as of ([^.(]+)/
        );

        if (dateMatch) {
          renewDate = dateMatch[1].trim();
        }

        // استخراج عدد الأيام
        const daysMatch = renewResult.match(
          /in (\d+ day\(s\)|\d+ days?)/
        );

        if (daysMatch) {
          remaining = daysMatch[1];
        }

        return Response.json({
          ok: true,
          status: "pending",
          title: "⏳ التجديد غير متاح حاليًا",
          message: "لا يمكنك تجديد السيرفر في الوقت الحالي",
          server_id: result.server_id || null,
          renew_date: renewDate,
          remaining: remaining,
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        }, { status: 200 });
      }

      // ==========================================
      // التجديد ناجح
      // ==========================================
      if (
        result.ok === true &&
        typeof renewResult === "string" &&
        renewResult.includes("renew=success")
      ) {
        return Response.json({
          ok: true,
          status: "success",
          title: "✅ تم التجديد بنجاح",
          message: "تم تجديد السيرفر بنجاح",
          server_id: result.server_id || null,
          result: renewResult,
          brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
          powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
        }, { status: 200 });
      }

      // ==========================================
      // أي نتيجة أخرى
      // ==========================================
      return Response.json({
        ok: result.ok ?? false,
        status: result.ok ? "success" : "error",
        title: result.ok
          ? "✅ تم تنفيذ الطلب"
          : "❌ حدث خطأ",
        message: renewResult || result.error || "لا توجد تفاصيل",
        server_id: result.server_id || null,
        result: result.result || null,
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
        powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
      }, { status: response.status });

    } catch (error) {

      // ==========================================
      // خطأ داخلي
      // ==========================================
      return Response.json({
        ok: false,
        status: "server_error",
        title: "❌ خطأ في API",
        message: "حدث خطأ أثناء الاتصال بالخدمة",
        brand: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐",
        powered_by: "𝑻𝒆𝒂𝒎 𝑴𝒂𝒓𝒐 API"
      }, { status: 500 });
    }
  }
};
