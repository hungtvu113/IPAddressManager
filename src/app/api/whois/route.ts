import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain không được để trống' },
        { status: 400 }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Domain không hợp lệ' },
        { status: 400 }
      );
    }

    try {
      // Try to use whois command if available
      const { stdout, stderr } = await execAsync(`whois ${domain}`);
      
      if (stderr) {
        throw new Error('WHOIS command failed');
      }

      // Parse whois output
      const lines = stdout.split('\n');
      const result: any = {
        domain,
        rawOutput: stdout
      };

      // Extract common fields
      for (const line of lines) {
        const lower = line.toLowerCase();
        
        if (lower.includes('registrar:')) {
          result.registrar = line.split(':')[1]?.trim();
        } else if (lower.includes('creation date:') || lower.includes('created:')) {
          result.registrationDate = line.split(':')[1]?.trim();
        } else if (lower.includes('expiry date:') || lower.includes('expires:')) {
          result.expirationDate = line.split(':')[1]?.trim();
        } else if (lower.includes('name server:') || lower.includes('nserver:')) {
          if (!result.nameServers) result.nameServers = [];
          const ns = line.split(':')[1]?.trim();
          if (ns && !result.nameServers.includes(ns)) {
            result.nameServers.push(ns);
          }
        } else if (lower.includes('status:')) {
          if (!result.status) result.status = [];
          const status = line.split(':')[1]?.trim();
          if (status && !result.status.includes(status)) {
            result.status.push(status);
          }
        }
      }

      return NextResponse.json(result);

    } catch (error) {
      // Fallback: Use a simple HTTP-based WHOIS service or return basic info
      return NextResponse.json({
        domain,
        error: 'WHOIS service không khả dụng. Vui lòng thử lại sau.',
        message: 'Để có thông tin WHOIS đầy đủ, bạn có thể sử dụng các công cụ WHOIS trực tuyến khác.'
      });
    }

  } catch (error) {
    console.error('WHOIS API error:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi thực hiện WHOIS lookup' },
      { status: 500 }
    );
  }
}
