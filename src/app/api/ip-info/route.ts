import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy IP từ query parameter hoặc lấy IP của client
    const { searchParams } = new URL(request.url);
    const queryIP = searchParams.get('ip');

    // Nếu không có IP trong query, lấy IP của client
    let targetIP = queryIP;
    if (!targetIP) {
      // Lấy IP từ headers
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                       request.headers.get('x-real-ip');

      // Nếu là localhost/loopback IP, dùng 'me' để lấy IP công khai
      if (!clientIP ||
          clientIP === '::1' ||
          clientIP === '127.0.0.1' ||
          clientIP.startsWith('::ffff:127.') ||
          clientIP.startsWith('localhost')) {
        targetIP = ''; // Empty string sẽ lấy IP công khai của server
      } else {
        targetIP = clientIP;
      }
    }

    console.log('Fetching IP info for:', targetIP || 'public IP');

    // Gọi API ip-api.com từ server-side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Nếu targetIP rỗng, gọi API không có IP để lấy IP công khai
    const apiUrl = targetIP
      ? `http://ip-api.com/json/${targetIP}`
      : `http://ip-api.com/json/`;

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('IP API response not OK:', response.status);
      return NextResponse.json(
        { error: 'Không thể lấy thông tin IP từ API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('IP API response:', data);

    // Kiểm tra xem API có trả về lỗi không
    if (data.status === 'fail') {
      return NextResponse.json(
        { error: data.message || 'IP không hợp lệ' },
        { status: 400 }
      );
    }

    // Trả về dữ liệu
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('IP Info API error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Timeout: Không thể kết nối đến API sau 10 giây' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi server khi lấy thông tin IP' },
      { status: 500 }
    );
  }
}

