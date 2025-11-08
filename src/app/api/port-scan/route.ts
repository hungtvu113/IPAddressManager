import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from 'net';

export async function POST(request: NextRequest) {
  try {
    const { host, port } = await request.json();

    if (!host || !port) {
      return NextResponse.json(
        { error: 'Host và port không được để trống' },
        { status: 400 }
      );
    }

    // Validate port number
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return NextResponse.json(
        { error: 'Port phải là số từ 1 đến 65535' },
        { status: 400 }
      );
    }

    // Validate host format
    const hostRegex = /^[a-zA-Z0-9.-]+$/;
    if (!hostRegex.test(host)) {
      return NextResponse.json(
        { error: 'Host không hợp lệ' },
        { status: 400 }
      );
    }

    // Common port services mapping
    const commonPorts: { [key: number]: string } = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      993: 'IMAPS',
      995: 'POP3S',
      3389: 'RDP',
      5432: 'PostgreSQL',
      3306: 'MySQL',
      1433: 'SQL Server',
      6379: 'Redis',
      27017: 'MongoDB'
    };

    return new Promise<NextResponse>((resolve) => {
      const startTime = Date.now();
      const socket = createConnection(portNum, host);

      socket.setTimeout(5000); // 5 second timeout

      socket.on('connect', () => {
        const responseTime = Date.now() - startTime;
        socket.destroy();

        resolve(NextResponse.json({
          host,
          port: portNum,
          open: true,
          service: commonPorts[portNum] || 'Unknown',
          responseTime
        }));
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(NextResponse.json({
          host,
          port: portNum,
          open: false,
          error: 'Connection timeout'
        }));
      });

      socket.on('error', (error: any) => {
        socket.destroy();
        resolve(NextResponse.json({
          host,
          port: portNum,
          open: false,
          error: error.code === 'ECONNREFUSED' ? 'Connection refused' : 'Connection failed'
        }));
      });
    });

  } catch (error) {
    console.error('Port Scan API error:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi thực hiện port scan' },
      { status: 500 }
    );
  }
}
