import axios from 'axios';

export interface NetworkData {
  ipAddress: string;
  ipMapLink: string;
  country: string;
  city: string;
  state: string;
  timezone: string;
  protocol: string;
  ports: string[];
  packetsData: Record<string, unknown>;
  internetProvider: string;
  proxyVpn: boolean;
  connectionType: string;
}

export interface DeviceData {
  operatingSystem: string;
  browser: string;
  userAgent: string;
  navigationData?: Record<string, unknown>;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsMapLink?: string;
  deviceCountry: string;
  deviceCity: string;
  deviceState: string;
  weatherData?: WeatherData;
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
    let geoData = null;
    
    try {
      // Usar serviço externo para geolocalização por IP
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      geoData = response.data;
    } catch (error) {
      console.error('Erro ao obter dados geográficos:', error);
    }
    
    return {
      ipAddress,
      ipMapLink: `https://www.google.com/maps/search/?api=1&query=${ipAddress}`,
      country: geoData?.country || 'Unknown',
      city: geoData?.city || 'Unknown',
      state: geoData?.regionName || 'Unknown',
      timezone: geoData?.timezone || 'Unknown',
      protocol: this.detectProtocol(request),
      ports: this.detectPorts(request),
      packetsData: await this.getPacketsData(request),
      internetProvider: geoData?.isp || 'Unknown',
      proxyVpn: geoData?.proxy || false,
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
      const weatherResult = await this.getWeatherData(gpsCoords.lat, gpsCoords.lng);
      if (weatherResult) {
        deviceData.weatherData = weatherResult;
      }
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
  private static async getPacketsData(request: Request): Promise<Record<string, unknown>> {
    return {
      method: request.method,
      contentLength: request.headers.get('content-length') || '0',
      acceptEncoding: request.headers.get('accept-encoding') || '',
      connection: request.headers.get('connection') || '',
      timestamp: new Date().toISOString()
    };
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

  // Obter localização por GPS (API gratuita com fallback)
  private static async getLocationFromGPS(lat: number, lng: number): Promise<Record<string, string> | null> {
    try {
      // Primeira tentativa: OpenCage API (gratuita até 2500/dia)
      const geocodeApiKey = process.env.OPENCAGE_API_KEY;
      
      if (geocodeApiKey && geocodeApiKey !== 'GET_FREE_KEY_AT_OPENCAGEDATA_COM') {
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${geocodeApiKey}&language=pt&pretty=1`
          );
          
          if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            const components = result.components;
            
            return {
              country: components.country || 'Desconhecido',
              state: components.state || 'Desconhecido',
              city: components.city || components.town || components.village || 'Desconhecido',
              address: result.formatted || 'Endereço não disponível'
            };
          }
        } catch (error) {
          console.error('Erro na API OpenCage:', error);
        }
      }

      // Fallback: API gratuita sem chave (BigDataCloud)
      const fallbackResponse = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`
      );
      
      const data = fallbackResponse.data;
      return {
        country: data.countryName || 'Desconhecido',
        state: data.principalSubdivision || 'Desconhecido', 
        city: data.city || data.locality || 'Desconhecido',
        address: data.localityInfo?.administrative?.[0]?.name || 'Endereço não disponível'
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return {
        country: 'Desconhecido',
        state: 'Desconhecido',
        city: 'Desconhecido',
        address: 'Localização não disponível'
      };
    }
  }

  // Obter dados meteorológicos (API gratuita com fallback)
  private static async getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      // Primeira tentativa: OpenWeatherMap API (gratuita até 1000/dia)
      const weatherApiKey = process.env.OPENWEATHER_API_KEY;
      
      if (weatherApiKey && weatherApiKey !== 'GET_FREE_KEY_AT_OPENWEATHERMAP_ORG') {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric&lang=pt_br`
          );
          
          const weather = weatherResponse.data;
          return {
            temperature: weather.main.temp,
            description: weather.weather[0].description,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            windSpeed: weather.wind?.speed || 0,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error('Erro na API OpenWeatherMap:', error);
        }
      }

      // Fallback: API gratuita sem chave (wttr.in)
      const fallbackResponse = await axios.get(
        `https://wttr.in/${lat},${lng}?format=j1`
      );
      
      const data = fallbackResponse.data;
      const current = data.current_condition[0];
      
      return {
        temperature: parseFloat(current.temp_C),
        description: current.weatherDesc[0].value,
        humidity: parseFloat(current.humidity),
        pressure: parseFloat(current.pressure),
        windSpeed: parseFloat(current.windspeedKmph) / 3.6, // Converter para m/s
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao obter dados meteorológicos:', error);
      return {
        temperature: 0,
        description: 'Dados indisponíveis',
        humidity: 0,
        pressure: 0,
        windSpeed: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar se GPS está habilitado (obrigatório para o sistema)
  static checkGPSPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => {
          console.error('GPS Error:', error);
          resolve(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Obter coordenadas GPS (obrigatório para funcionamento)
  static getGPSCoordinates(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS_NOT_SUPPORTED'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('GPS Error:', error);
          switch (error.code) {
            case 1:
              reject(new Error('GPS_PERMISSION_DENIED'));
              break;
            case 2:
              reject(new Error('GPS_POSITION_UNAVAILABLE'));
              break;
            case 3:
              reject(new Error('GPS_TIMEOUT'));
              break;
            default:
              reject(new Error('GPS_UNKNOWN_ERROR'));
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  }
}