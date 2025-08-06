import net from 'node:net';
import { Injectable } from '@nestjs/common';

// N.B. Keep in mind that we used LLMs to help us create this service (for the idea of how to do it), maybe we can improve it later.

const FORBIDDEN_IP_RANGES = [
  // Private IPs
  ['10.0.0.0', '10.255.255.255'],
  ['172.16.0.0', '172.31.255.255'],
  ['192.168.0.0', '192.168.255.255'],
  // localhost Ipv4
  ['127.0.0.0', '127.255.255.255'],
  // localhost Ipv6
  ['::1', '::1'],
  // Cloud services Metadata
  ['169.254.169.254', '169.254.169.254'],
];

// We readded some domains that are already in the forbidden IP ranges, just in case
const FORBIDDEN_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  'local',
  'intranet', // Maybe in future we need to remove this one (e.g. for an entreprise intranet)
  'internal',
  '192.168.0.0/16',
  '10.0.0.0/8',
  '172.16.0.0/12',
  'fc00::/7',
  'fe80::/10',
];

@Injectable()
export class UrlValidationService {
  forbiddenIpRanges = FORBIDDEN_IP_RANGES;
  forbiddenDomains = FORBIDDEN_DOMAINS;

  private ipToLong(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0); // ipv4 is 32 bits so we can convert it to a long
  }

  private isIpInRange(ip: string, start: string, end: string): boolean {
    const ipNum = this.ipToLong(ip);
    const startNum = this.ipToLong(start);
    const endNum = this.ipToLong(end);
    return ipNum >= startNum && ipNum <= endNum;
  }

  private isForbiddenIp(ip: string): boolean {
    if (ip === '::1' || ip === '127.0.0.1')
      return true;

    if (!net.isIP(ip))
      return false;

    for (const [start, end] of this.forbiddenIpRanges) {
      if (this.isIpInRange(ip, start, end))
        return true;
    }
    return false;
  }

  private isForbiddenDomain(domain: string): boolean {
    return this.forbiddenDomains.some(d => domain.includes(d));
  }

  isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);

      if (url.protocol !== 'http:' && url.protocol !== 'https:')
        return false;

      if (this.isForbiddenIp(url.hostname) || this.isForbiddenDomain(url.hostname))
        return false;

      return true;
    }
    catch {
      return false;
    }
  }
}
