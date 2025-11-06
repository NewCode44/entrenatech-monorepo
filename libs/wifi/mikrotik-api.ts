// MikroTik RouterOS API - Integración para gestión de hotspot y tráfico
// Implementa el protocolo API de MikroTik para control del WiFi

export interface MikroTikConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  timeout?: number;
}

export interface HotspotUser {
  macAddress: string;
  ipAddress: string;
  name: string;
  membershipType: 'basic' | 'premium' | 'vip';
  sessionTimeout: number; // segundos
  dataLimit?: number; // MB
  uploadLimit: number; // Mbps
  downloadLimit: number; // Mbps;
}

export interface TrafficStats {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  uptime: number; // segundos
}

export class MikroTikAPI {
  private config: MikroTikConfig;
  private socket: any = null;
  private tagCounter: number = 1;

  constructor(config: MikroTikConfig) {
    this.config = {
      timeout: 10000,
      ...config
    };
  }

  /**
   * Conectar al router MikroTik
   */
  async connect(): Promise<boolean> {
    try {
      const net = await import('net');
      this.socket = new net.Socket();

      return new Promise((resolve, reject) => {
        this.socket.setTimeout(this.config.timeout);

        this.socket.connect(this.config.port, this.config.host, () => {
          // Iniciar login
          this.login().then(() => resolve(true)).catch(reject);
        });

        this.socket.on('error', (error: any) => {
          reject(new Error(`Error conectando a MikroTik: ${error.message}`));
        });

        this.socket.on('timeout', () => {
          this.socket.destroy();
          reject(new Error('Timeout de conexión a MikroTik'));
        });
      });
    } catch (error) {
      throw new Error(`Error de conexión: ${error.message}`);
    }
  }

  /**
   * Login en el router
   */
  private async login(): Promise<void> {
    try {
      // Enviar login
      const loginResponse = await this.write(['/login'], false);

      // Extraer challenge
      const challenge = this.extractChallenge(loginResponse);

      // Generar respuesta MD5
      const md5 = await import('crypto');
      const hash = md5.createHash('md5');
      hash.update('\x00');
      hash.update(this.config.password);
      hash.update(challenge);
      const response = hash.digest('hex');

      // Enviar credenciales
      const authResponse = await this.write([
        '/login',
        `=name=${this.config.username}`,
        `=response=00${response}`
      ]);

      if (this.hasError(authResponse)) {
        throw new Error('Autenticación fallida');
      }
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  /**
   * Agregar usuario al hotspot
   */
  async addHotspotUser(user: HotspotUser): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      await this.ensureConnected();

      const response = await this.write([
        '/ip/hotspot/active/add',
        `=mac-address=${user.macAddress}`,
        `=address=${user.ipAddress}`,
        `=comment=EntrenaTech-${user.membershipType}`,
        `=timeout=${user.sessionTimeout}`
      ]);

      if (this.hasError(response)) {
        return {
          success: false,
          error: this.extractErrorMessage(response)
        };
      }

      // Obtener ID del usuario creado
      const userId = this.extractId(response);

      // Configurar límite de tráfico si especifica
      if (user.dataLimit) {
        await this.setDataLimit(userId, user.dataLimit);
      }

      return {
        success: true,
        id: userId
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Configurar cola de tráfico (QoS)
   */
  async setTrafficQueue(user: HotspotUser): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const queueName = `EntrenaTech-${user.macAddress.replace(/:/g, '')}`;
      const maxLimit = `${user.downloadLimit}M/${user.uploadLimit}M`;

      const response = await this.write([
        '/queue/simple/add',
        `=name=${queueName}`,
        `=target=${user.ipAddress}`,
        `=max-limit=${maxLimit}`,
        `=comment=EntrenaTech-${user.membershipType}`
      ]);

      if (this.hasError(response)) {
        return {
          success: false,
          error: this.extractErrorMessage(response)
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remover usuario del hotspot
   */
  async removeHotspotUser(macAddress: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      // Buscar usuario por MAC
      const userId = await this.findHotspotUserId(macAddress);
      if (!userId) {
        return {
          success: false,
          error: 'Usuario no encontrado en hotspot'
        };
      }

      // Remover del hotspot
      const response = await this.write([
        '/ip/hotspot/active/remove',
        `=.id=${userId}`
      ]);

      if (this.hasError(response)) {
        return {
          success: false,
          error: this.extractErrorMessage(response)
        };
      }

      // Remover cola de tráfico
      await this.removeTrafficQueue(macAddress);

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener estadísticas de tráfico de un usuario
   */
  async getUserTrafficStats(macAddress: string): Promise<TrafficStats | null> {
    try {
      await this.ensureConnected();

      const response = await this.write([
        '/ip/hotspot/active/print',
        `?=mac-address=${macAddress}`
      ]);

      if (this.hasError(response) || response.length === 0) {
        return null;
      }

      const user = response[0];
      return {
        bytesIn: parseInt(user['bytes-in']) || 0,
        bytesOut: parseInt(user['bytes-out']) || 0,
        packetsIn: parseInt(user['packets-in']) || 0,
        packetsOut: parseInt(user['packets-out']) || 0,
        uptime: parseInt(user['uptime']) || 0
      };

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  /**
   * Configurar límite de datos para usuario
   */
  async setDataLimit(userId: string, limitMB: number): Promise<boolean> {
    try {
      await this.ensureConnected();

      const response = await this.write([
        '/ip/hotspot/active/set',
        `=.id=${userId}`,
        `=limit-bytes-in=${limitMB * 1024 * 1024}`,
        `=limit-bytes-out=${limitMB * 1024 * 1024}`
      ]);

      return !this.hasError(response);

    } catch (error) {
      console.error('Error configurando límite de datos:', error);
      return false;
    }
  }

  /**
   * Obtener lista de usuarios activos
   */
  async getActiveUsers(): Promise<Array<{
    id: string;
    macAddress: string;
    ipAddress: string;
    name: string;
    uptime: number;
    comment: string;
  }>> {
    try {
      await this.ensureConnected();

      const response = await this.write(['/ip/hotspot/active/print']);

      if (this.hasError(response)) {
        return [];
      }

      return response.map(user => ({
        id: user['.id'],
        macAddress: user['mac-address'],
        ipAddress: user['address'],
        name: user['user'] || 'Unknown',
        uptime: this.parseUptime(user['uptime']),
        comment: user['comment'] || ''
      }));

    } catch (error) {
      console.error('Error obteniendo usuarios activos:', error);
      return [];
    }
  }

  /**
   * Desconectar del router
   */
  async disconnect(): Promise<void> {
    if (this.socket) {
      try {
        await this.write(['/quit']);
        this.socket.destroy();
      } catch (error) {
        console.error('Error desconectando:', error);
      }
      this.socket = null;
    }
  }

  // === Métodos privados ===

  private async ensureConnected(): Promise<void> {
    if (!this.socket || this.socket.destroyed) {
      await this.connect();
    }
  }

  private async write(words: string[], expectReply: boolean = true): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.destroyed) {
        reject(new Error('No hay conexión activa con MikroTik'));
        return;
      }

      const tag = this.tagCounter++;
      const sentence = this.encodeSentence(words, tag);

      let buffer = Buffer.alloc(0);
      let complete = false;

      const onData = (data: Buffer) => {
        buffer = Buffer.concat([buffer, data]);

        while (buffer.length > 0) {
          try {
            const result = this.decodeSentence(buffer);
            if (result) {
              buffer = buffer.slice(result.length);

              if (result.tag === tag) {
                if (result.type === 'done') {
                  complete = true;
                  this.socket.off('data', onData);
                  resolve(result.data);
                } else if (result.type === 'error') {
                  complete = true;
                  this.socket.off('data', onData);
                  reject(new Error(`MikroTik API Error: ${result.message}`));
                }
              }
            }
          } catch (error) {
            this.socket.off('data', onData);
            reject(error);
            return;
          }
        }
      };

      this.socket.on('data', onData);
      this.socket.write(sentence);

      // Timeout
      setTimeout(() => {
        if (!complete) {
          this.socket.off('data', onData);
          reject(new Error('Timeout en comunicación con MikroTik'));
        }
      }, this.config.timeout);
    });
  }

  private encodeSentence(words: string[], tag: number): Buffer {
    const encodedWords = words.map(word => this.encodeWord(word));
    const tagWord = this.encodeWord(`.tag=${tag}`);
    return Buffer.concat([...encodedWords, tagWord, Buffer.from([0])]);
  }

  private encodeWord(word: string): Buffer {
    const length = word.length;
    let encoded: Buffer;

    if (length < 0x80) {
      encoded = Buffer.alloc(1 + length);
      encoded.writeUInt8(length, 0);
      encoded.write(word, 1);
    } else if (length < 0x4000) {
      encoded = Buffer.alloc(2 + length);
      encoded.writeUInt8(0x80 | (length >> 8), 0);
      encoded.writeUInt8(length & 0xFF, 1);
      encoded.write(word, 2);
    } else if (length < 0x200000) {
      encoded = Buffer.alloc(3 + length);
      encoded.writeUInt8(0xC0 | (length >> 16), 0);
      encoded.writeUInt8((length >> 8) & 0xFF, 1);
      encoded.writeUInt8(length & 0xFF, 2);
      encoded.write(word, 3);
    } else {
      throw new Error('Palabra muy larga');
    }

    return encoded;
  }

  private decodeSentence(buffer: Buffer): { length: number; tag: number; type: string; data: any[]; message?: string } | null {
    if (buffer.length === 0 || buffer[buffer.length - 1] !== 0) {
      return null;
    }

    let offset = 0;
    const words: string[] = [];
    let tag = 0;

    while (offset < buffer.length - 1) {
      const wordLength = this.decodeLength(buffer, offset);
      if (!wordLength) break;

      offset += wordLength.offset;
      const word = buffer.slice(offset, offset + wordLength.length).toString();
      words.push(word);
      offset += wordLength.length;

      if (word.startsWith('.tag=')) {
        tag = parseInt(word.substring(5));
      }
    }

    const totalLength = offset + 1; // +1 para el byte 0 final
    const type = words.length > 0 && words[0].startsWith('!') ? 'error' : 'done';
    const data = type === 'error' ? [] : words.map(word => this.parseWord(word));

    return {
      length: totalLength,
      tag,
      type,
      data,
      message: type === 'error' ? words[0].substring(1) : undefined
    };
  }

  private decodeLength(buffer: Buffer, offset: number): { offset: number; length: number } | null {
    if (offset >= buffer.length) return null;

    const firstByte = buffer[offset];

    if (firstByte < 0x80) {
      return { offset: 1, length: firstByte };
    } else if ((firstByte & 0xC0) === 0x80) {
      if (offset + 1 >= buffer.length) return null;
      const length = ((firstByte & 0x3F) << 8) | buffer[offset + 1];
      return { offset: 2, length };
    } else if ((firstByte & 0xE0) === 0xC0) {
      if (offset + 2 >= buffer.length) return null;
      const length = ((firstByte & 0x1F) << 16) | (buffer[offset + 1] << 8) | buffer[offset + 2];
      return { offset: 3, length };
    }

    return null;
  }

  private parseWord(word: string): any {
    if (!word.includes('=')) return word;

    const [key, value] = word.split('=', 2);

    // Intentar convertir a número
    if (/^\d+$/.test(value)) {
      return { [key]: parseInt(value) };
    }

    return { [key]: value };
  }

  private extractChallenge(response: any[]): string {
    for (const item of response) {
      if (item && typeof item === 'object' && item['ret']) {
        return item['ret'];
      }
    }
    throw new Error('No se pudo extraer challenge del login');
  }

  private hasError(response: any[]): boolean {
    return response.some(item =>
      typeof item === 'string' && item.startsWith('!')
    );
  }

  private extractErrorMessage(response: any[]): string {
    const error = response.find(item =>
      typeof item === 'string' && item.startsWith('!')
    );
    return error ? error.substring(1) : 'Error desconocido';
  }

  private extractId(response: any[]): string {
    const item = response.find(item =>
      item && typeof item === 'object' && item['.id']
    );
    return item ? item['.id'] : '';
  }

  private async findHotspotUserId(macAddress: string): Promise<string | null> {
    try {
      const response = await this.write([
        '/ip/hotspot/active/print',
        `?=mac-address=${macAddress}`
      ]);

      if (this.hasError(response) || response.length === 0) {
        return null;
      }

      const user = response.find(item =>
        item && typeof item === 'object' && item['.id']
      );

      return user ? user['.id'] : null;

    } catch (error) {
      console.error('Error buscando ID de usuario:', error);
      return null;
    }
  }

  private async removeTrafficQueue(macAddress: string): Promise<void> {
    try {
      const queueName = `EntrenaTech-${macAddress.replace(/:/g, '')}`;
      const response = await this.write([
        '/queue/simple/print',
        `?name=${queueName}`
      ]);

      if (!this.hasError(response) && response.length > 0) {
        const queueId = response[0]['.id'];
        await this.write(['/queue/simple/remove', `=.id=${queueId}`]);
      }

    } catch (error) {
      console.error('Error removiendo cola de tráfico:', error);
    }
  }

  private parseUptime(uptimeStr: string): number {
    // Parsear formato de uptime de MikroTik (ej: "2h3m15s")
    const match = uptimeStr.match(/(\d+)([hms])/g);
    if (!match) return 0;

    return match.reduce((total, part) => {
      const value = parseInt(part.slice(0, -1));
      const unit = part.slice(-1);

      switch (unit) {
        case 'h': return total + (value * 3600);
        case 'm': return total + (value * 60);
        case 's': return total + value;
        default: return total;
      }
    }, 0);
  }
}

export const mikrotikAPI = (config: MikroTikConfig) => new MikroTikAPI(config);