import { NextRequest, NextResponse } from 'next/server';
import { promises as dns } from 'dns';

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

    const records: any = {};

    try {
      // A Records
      try {
        const aRecords = await dns.resolve4(domain);
        records.A = aRecords.map(ip => ({ type: 'A', value: ip }));
      } catch (error) {
        // A record not found, continue
      }

      // AAAA Records (IPv6)
      try {
        const aaaaRecords = await dns.resolve6(domain);
        records.AAAA = aaaaRecords.map(ip => ({ type: 'AAAA', value: ip }));
      } catch (error) {
        // AAAA record not found, continue
      }

      // MX Records
      try {
        const mxRecords = await dns.resolveMx(domain);
        records.MX = mxRecords.map(mx => ({ 
          type: 'MX', 
          value: mx.exchange,
          priority: mx.priority 
        }));
      } catch (error) {
        // MX record not found, continue
      }

      // NS Records
      try {
        const nsRecords = await dns.resolveNs(domain);
        records.NS = nsRecords.map(ns => ({ type: 'NS', value: ns }));
      } catch (error) {
        // NS record not found, continue
      }

      // TXT Records
      try {
        const txtRecords = await dns.resolveTxt(domain);
        records.TXT = txtRecords.map(txt => ({ 
          type: 'TXT', 
          value: Array.isArray(txt) ? txt.join('') : txt 
        }));
      } catch (error) {
        // TXT record not found, continue
      }

      // CNAME Records
      try {
        const cnameRecords = await dns.resolveCname(domain);
        records.CNAME = cnameRecords.map(cname => ({ type: 'CNAME', value: cname }));
      } catch (error) {
        // CNAME record not found, continue
      }

      // Check if any records were found
      if (Object.keys(records).length === 0) {
        return NextResponse.json({
          domain,
          records: {},
          error: 'Không tìm thấy DNS records cho domain này'
        });
      }

      return NextResponse.json({
        domain,
        records
      });

    } catch (error) {
      return NextResponse.json({
        domain,
        records: {},
        error: 'Không thể tra cứu DNS cho domain này'
      });
    }

  } catch (error) {
    console.error('DNS Lookup API error:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi thực hiện DNS lookup' },
      { status: 500 }
    );
  }
}
