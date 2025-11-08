import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { host } = await request.json();

    if (!host) {
      return NextResponse.json(
        { error: 'Host không được để trống' },
        { status: 400 }
      );
    }

    // Validate host format (basic validation)
    const hostRegex = /^[a-zA-Z0-9.-]+$/;
    if (!hostRegex.test(host)) {
      return NextResponse.json(
        { error: 'Host không hợp lệ' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    try {
      // Use ping command (works on both Windows and Unix)
      const isWindows = process.platform === 'win32';
      const pingCommand = isWindows 
        ? `ping -n 1 ${host}` 
        : `ping -c 1 ${host}`;

      const { stdout, stderr } = await execAsync(pingCommand);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Parse ping output to determine if host is alive
      const isAlive = !stderr && (
        stdout.includes('TTL=') || // Windows
        stdout.includes('ttl=') || // Unix
        stdout.includes('time=')   // Unix
      );

      // Extract actual ping time from output if available
      let actualTime = responseTime;
      const timeMatch = stdout.match(/time[<=](\d+(?:\.\d+)?)ms/i);
      if (timeMatch) {
        actualTime = parseFloat(timeMatch[1]);
      }

      return NextResponse.json({
        host,
        alive: isAlive,
        time: actualTime,
        output: stdout
      });

    } catch (error) {
      // Host is not reachable
      return NextResponse.json({
        host,
        alive: false,
        time: Date.now() - startTime,
        error: 'Host không thể kết nối'
      });
    }

  } catch (error) {
    console.error('Ping API error:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi thực hiện ping' },
      { status: 500 }
    );
  }
}
