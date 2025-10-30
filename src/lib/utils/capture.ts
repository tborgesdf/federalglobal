import axios from 'axios';
import geoip from 'geoip-lite';

export interface NetworkData {
  ipAddress: string;
  ipMapLink: string;
  country: string;
  city: string;
  state: string;
  timezone: string;
  protocol: string;
  ports: string[];
  packetsData: any;
  internetProvider: string;
  proxyVpn: boolean;
  connectionType: string;
}

export interface DeviceData {
  operatingSystem: string;
  browser: string;
  userAgent: string;
  navigationData?: any;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsMapLink?: string;
  deviceCountry: string;
  deviceCity: string;
  deviceState: string;
  weatherData?: any;
}

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  timestamp: string;
}

export class CaptureUtils {
  // Capturar dados de rede baseado no IP
  static async captureNetworkData(request: Request): Promise<NetworkData> {
    const ipAddress = this.getClientIP(request);
    const geoData = geoip.lookup(ipAddress);
    
    return {
      ipAddress,
      ipMapLink: `https://www.google.com/maps/search/?api=1&query=${ipAddress}`,
      country: geoData?.country || 'Unknown',
      city: geoData?.city || 'Unknown',
      state: geoData?.region || 'Unknown',
      timezone: geoData?.timezone || 'Unknown',
      protocol: this.detectProtocol(request),
      ports: this.detectPorts(request),
      packetsData: await this.getPacketsData(request),
      internetProvider: await this.getInternetProvider(ipAddress),
      proxyVpn: await this.detectProxyVPN(ipAddress),
      connectionType: this.detectConnectionType(request)
    };
  }

  // Capturar dados do dispositivo
  static async captureDeviceData(request: Request, gpsCoords?: { lat: number; lng: number }): Promise<DeviceData> {
    const userAgent = request.headers.get('user-agent') || '';
    const geoData = gpsCoords ? await this.getLocationFromGPS(gpsCoords.lat, gpsCoords.lng) : null;
    
    const deviceData: DeviceData = {
      operatingSystem: this.detectOS(userAgent),
      browser: this.detectBrowser(userAgent),
      userAgent,
      deviceCountry: geoData?.country || 'Unknown',
      deviceCity: geoData?.city || 'Unknown',
      deviceState: geoData?.state || 'Unknown'
    };

    if (gpsCoords) {
      deviceData.gpsLatitude = gpsCoords.lat;
      deviceData.gpsLongitude = gpsCoords.lng;
      deviceData.gpsMapLink = `https://www.google.com/maps/search/?api=1&query=${gpsCoords.lat},${gpsCoords.lng}`;
      deviceData.weatherData = await this.getWeatherData(gpsCoords.lat, gpsCoords.lng);
    }

    return deviceData;
  }

  // Obter IP do cliente
  private static getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const real = request.headers.get('x-real-ip');
    const cloudflare = request.headers.get('cf-connecting-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return real || cloudflare || '127.0.0.1';
  }

  // Detectar protocolo
  private static detectProtocol(request: Request): string {
    const url = new URL(request.url);
    return url.protocol.replace(':', '');
  }

  // Detectar portas utilizadas
  private static detectPorts(request: Request): string[] {
    const url = new URL(request.url);
    const defaultPorts = {
      'http': '80',
      'https': '443'
    };
    
    const port = url.port || defaultPorts[url.protocol.replace(':', '') as keyof typeof defaultPorts] || '80';
    return [port];
  }

  // Obter dados de pacotes (simulado)
  private static async getPacketsData(request: Request): Promise<any> {
    return {
      method: request.method,
      contentLength: request.headers.get('content-length') || '0',
      acceptEncoding: request.headers.get('accept-encoding') || '',
      connection: request.headers.get('connection') || '',
      timestamp: new Date().toISOString()
    };
  }

  // Detectar provedor de internet
  private static async getInternetProvider(ip: string): Promise<string> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      return response.data.isp || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  // Detectar proxy/VPN
  private static async detectProxyVPN(ip: string): Promise<boolean> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=proxy`);
      return response.data.proxy || false;
    } catch {
      return false;
    }
  }

  // Detectar tipo de conexão
  private static detectConnectionType(request: Request): string {
    const userAgent = request.headers.get('user-agent') || '';
    
    if (userAgent.includes('Mobile')) {
      if (userAgent.includes('5G')) return '5G';
      if (userAgent.includes('4G')) return '4G';
      if (userAgent.includes('3G')) return '3G';
      return 'Mobile';
    }
    
    return 'Wi-Fi';
  }

  // Detectar sistema operacional
  private static detectOS(userAgent: string): string {
    if (userAgent.includes('Windows NT')) return 'Windows';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }

  // Detectar navegador
  private static detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  // Obter localização por GPS
  private static async getLocationFromGPS(lat: number, lng: number): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`
      );
      
      const result = response.data.results[0];
      return {
        country: result?.components?.country || 'Unknown',
        city: result?.components?.city || result?.components?.town || 'Unknown',
        state: result?.components?.state || 'Unknown'
      };
    } catch {
      return {
        country: 'Unknown',
        city: 'Unknown',
        state: 'Unknown'
      };
    }
  }

  // Obter dados meteorológicos
  private static async getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );
      
      const data = response.data;
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        timestamp: new Date().toISOString()
      };
    } catch {
      return null;
    }
  }
}