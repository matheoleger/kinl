import { UrlValidationService } from '../services/url-validation.service';

jest.mock('node:net', () => ({
  __esModule: true,
  default: {
    isIP: jest.fn((ip: string) => {
      const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;
      if (ipv4Regex.test(ip))
        return 4;
      if (ipv6Regex.test(ip))
        return 6;
      return 0;
    }),
  },
}));

describe('urlValidationService', () => {
  let service: UrlValidationService;

  beforeEach(() => {
    service = new UrlValidationService();
  });

  describe('isValidUrl', () => {
    describe('valid URLs', () => {
      it('should validate HTTPS URLs', () => {
        expect(service.isValidUrl('https://example.com')).toBe(true);
        expect(service.isValidUrl('https://www.example.com')).toBe(true);
        expect(service.isValidUrl('https://example.com/path')).toBe(true);
        expect(service.isValidUrl('https://example.com/path?param=value')).toBe(true);
        expect(service.isValidUrl('https://example.com/path#fragment')).toBe(true);
      });

      it('should validate HTTP URLs', () => {
        expect(service.isValidUrl('http://example.com')).toBe(true);
        expect(service.isValidUrl('http://www.example.com')).toBe(true);
        expect(service.isValidUrl('http://example.com/path')).toBe(true);
      });

      it('should validate URLs with ports', () => {
        expect(service.isValidUrl('https://example.com:8080')).toBe(true);
        expect(service.isValidUrl('http://example.com:3000')).toBe(true);
      });

      it('should validate URLs with subdomains', () => {
        expect(service.isValidUrl('https://api.example.com')).toBe(true);
        expect(service.isValidUrl('https://blog.example.com')).toBe(true);
      });
    });

    describe('invalid URLs', () => {
      it('should reject invalid URL formats', () => {
        expect(service.isValidUrl('not-a-url')).toBe(false);
        expect(service.isValidUrl('example.com')).toBe(false);
        expect(service.isValidUrl('ftp://example.com')).toBe(false);
        expect(service.isValidUrl('')).toBe(false);
        expect(service.isValidUrl('null')).toBe(false);
        expect(service.isValidUrl('undefined')).toBe(false);
      });

      it('should reject URLs with invalid protocols', () => {
        expect(service.isValidUrl('ftp://example.com')).toBe(false);
        expect(service.isValidUrl('smtp://example.com')).toBe(false);
        expect(service.isValidUrl('file:///path/to/file')).toBe(false);
        expect(service.isValidUrl('ws://example.com')).toBe(false);
        expect(service.isValidUrl('wss://example.com')).toBe(false);
      });

      it('should reject URLs with forbidden IP addresses', () => {
        // Private IP ranges
        expect(service.isValidUrl('http://10.0.0.1')).toBe(false);
        expect(service.isValidUrl('http://10.255.255.255')).toBe(false);
        expect(service.isValidUrl('http://172.16.0.1')).toBe(false);
        expect(service.isValidUrl('http://172.31.255.255')).toBe(false);
        expect(service.isValidUrl('http://192.168.0.1')).toBe(false);
        expect(service.isValidUrl('http://192.168.255.255')).toBe(false);

        // Localhost
        expect(service.isValidUrl('http://127.0.0.1')).toBe(false);
        expect(service.isValidUrl('http://127.255.255.255')).toBe(false);
        expect(service.isValidUrl('http://::1')).toBe(false);

        // Cloud metadata
        expect(service.isValidUrl('http://169.254.169.254')).toBe(false);
      });

      it('should reject URLs with forbidden domains', () => {
        expect(service.isValidUrl('http://localhost')).toBe(false);
        expect(service.isValidUrl('http://localhost:3000')).toBe(false);
        expect(service.isValidUrl('http://127.0.0.1')).toBe(false);
        expect(service.isValidUrl('http://::1')).toBe(false);
        expect(service.isValidUrl('http://0.0.0.0')).toBe(false);
        expect(service.isValidUrl('http://local')).toBe(false);
        expect(service.isValidUrl('http://intranet')).toBe(false);
        expect(service.isValidUrl('http://internal')).toBe(false);
      });

      it('should reject URLs with forbidden domains as subdomains', () => {
        expect(service.isValidUrl('http://api.localhost')).toBe(false);
        expect(service.isValidUrl('http://dev.local')).toBe(false);
        expect(service.isValidUrl('http://test.intranet')).toBe(false);
        expect(service.isValidUrl('http://staging.internal')).toBe(false);
      });

      it('should reject malformed URLs', () => {
        expect(service.isValidUrl('http://')).toBe(false);
        expect(service.isValidUrl('https://')).toBe(false);
        expect(service.isValidUrl('://example.com')).toBe(false);
        expect(service.isValidUrl('example.com://')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle null and undefined values', () => {
        expect(service.isValidUrl(null as any)).toBe(false);
        expect(service.isValidUrl(undefined as any)).toBe(false);
      });

      it('should handle non-string values', () => {
        expect(service.isValidUrl(123 as any)).toBe(false);
        expect(service.isValidUrl({} as any)).toBe(false);
        expect(service.isValidUrl([] as any)).toBe(false);
      });

      it('should handle URLs with special characters', () => {
        expect(service.isValidUrl('https://example.com/path with spaces')).toBe(true);
        expect(service.isValidUrl('https://example.com/path%20with%20spaces')).toBe(true);
        expect(service.isValidUrl('https://example.com/path?param=value&another=param')).toBe(true);
      });

      it('should handle internationalized domain names', () => {
        expect(service.isValidUrl('https://müller.de')).toBe(true);
        expect(service.isValidUrl('https://café.com')).toBe(true);
      });
    });
  });

  describe('private methods', () => {
    describe('ipToLong', () => {
      it('should convert IP addresses to long numbers', () => {
        const ipToLong = (service as any).ipToLong.bind(service);

        expect(ipToLong('0.0.0.0')).toBe(0);
        expect(ipToLong('255.255.255.255')).toBe(4294967295);
        expect(ipToLong('127.0.0.1')).toBe(2130706433);
        expect(ipToLong('192.168.1.1')).toBe(3232235777);
      });
    });

    describe('isIpInRange', () => {
      it('should check if IP is in range', () => {
        const isIpInRange = (service as any).isIpInRange.bind(service);

        expect(isIpInRange('192.168.1.1', '192.168.0.0', '192.168.255.255')).toBe(true);
        expect(isIpInRange('192.168.1.1', '10.0.0.0', '10.255.255.255')).toBe(false);
        expect(isIpInRange('127.0.0.1', '127.0.0.0', '127.255.255.255')).toBe(true);
      });
    });

    describe('isForbiddenIp', () => {
      it('should identify forbidden IP addresses', () => {
        const isForbiddenIp = (service as any).isForbiddenIp.bind(service);

        expect(isForbiddenIp('127.0.0.1')).toBe(true);
        expect(isForbiddenIp('::1')).toBe(true);
        expect(isForbiddenIp('192.168.1.1')).toBe(true);
        expect(isForbiddenIp('10.0.0.1')).toBe(true);
        expect(isForbiddenIp('172.16.0.1')).toBe(true);
        expect(isForbiddenIp('169.254.169.254')).toBe(true);

        expect(isForbiddenIp('8.8.8.8')).toBe(false);
        expect(isForbiddenIp('1.1.1.1')).toBe(false);
        expect(isForbiddenIp('208.67.222.222')).toBe(false);
      });

      it('should handle invalid IP addresses', () => {
        const isForbiddenIp = (service as any).isForbiddenIp.bind(service);

        expect(isForbiddenIp('not-an-ip')).toBe(false);
        expect(isForbiddenIp('256.256.256.256')).toBe(false);
        expect(isForbiddenIp('1.2.3.4.5')).toBe(false);
      });
    });

    describe('isForbiddenDomain', () => {
      it('should identify forbidden domains', () => {
        const isForbiddenDomain = (service as any).isForbiddenDomain.bind(service);

        expect(isForbiddenDomain('localhost')).toBe(true);
        expect(isForbiddenDomain('127.0.0.1')).toBe(true);
        expect(isForbiddenDomain('::1')).toBe(true);
        expect(isForbiddenDomain('0.0.0.0')).toBe(true);
        expect(isForbiddenDomain('local')).toBe(true);
        expect(isForbiddenDomain('intranet')).toBe(true);
        expect(isForbiddenDomain('internal')).toBe(true);

        expect(isForbiddenDomain('example.com')).toBe(false);
        expect(isForbiddenDomain('google.com')).toBe(false);
        expect(isForbiddenDomain('api.example.com')).toBe(false);
      });

      it('should identify forbidden domains in subdomains', () => {
        const isForbiddenDomain = (service as any).isForbiddenDomain.bind(service);

        expect(isForbiddenDomain('api.localhost')).toBe(true);
        expect(isForbiddenDomain('dev.local')).toBe(true);
        expect(isForbiddenDomain('test.intranet')).toBe(true);
        expect(isForbiddenDomain('staging.internal')).toBe(true);
      });
    });
  });
});
