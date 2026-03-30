const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerPhone, comment, productName, category, brand } = await req.json();

    if (!customerName || !customerPhone || !productName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    if (!TELEGRAM_API_KEY) {
      throw new Error('TELEGRAM_API_KEY is not configured');
    }

    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!chatId) {
      throw new Error('TELEGRAM_CHAT_ID is not configured');
    }

    // Sanitize inputs
    const safeName = String(customerName).slice(0, 100).replace(/[<>&]/g, '');
    const safePhone = String(customerPhone).slice(0, 20).replace(/[<>&]/g, '');
    const safeComment = comment ? String(comment).slice(0, 500).replace(/[<>&]/g, '') : '';
    const safeProduct = String(productName).slice(0, 200).replace(/[<>&]/g, '');
    const safeCategory = category ? String(category).slice(0, 100).replace(/[<>&]/g, '') : '';
    const safeBrand = brand ? String(brand).slice(0, 100).replace(/[<>&]/g, '') : '';

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

    const text = `🛒 <b>Новый заказ!</b>\n\n` +
      `📦 <b>Товар:</b> ${safeProduct}\n` +
      (safeCategory ? `📂 <b>Категория:</b> ${safeCategory}\n` : '') +
      (safeBrand ? `🏷 <b>Бренд:</b> ${safeBrand}\n` : '') +
      `\n👤 <b>Имя:</b> ${safeName}\n` +
      `📞 <b>Телефон:</b> ${safePhone}\n` +
      (safeComment ? `💬 <b>Комментарий:</b> ${safeComment}\n` : '') +
      `\n🕐 ${now}`;

    console.log('Sending order to Telegram chat:', chatId);

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', JSON.stringify(data));
      throw new Error(`Telegram API call failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    console.log('Order sent successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
