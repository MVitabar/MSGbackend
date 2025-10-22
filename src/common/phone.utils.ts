import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneUtils {
  /**
   * Normaliza un número de teléfono eliminando caracteres especiales
   * @param phone Número de teléfono a normalizar
   * @returns Número de teléfono normalizado
   */
  static normalizePhone(phone: string): string {
    if (!phone) return '';

    // Eliminar todos los caracteres no numéricos excepto el signo +
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Valida si un número de teléfono tiene un formato básico válido
   * @param phone Número de teléfono a validar
   * @returns true si es válido, false en caso contrario
   */
  static isValidPhone(phone: string): boolean {
    if (!phone) return false;

    const normalized = this.normalizePhone(phone);

    // Mínimo 10 dígitos, máximo 15 (incluyendo código de país)
    return normalized.length >= 10 && normalized.length <= 15;
  }

  /**
   * Formatea un número de teléfono para mostrar
   * @param phone Número de teléfono
   * @param format Formato deseado: 'international' | 'national'
   * @returns Número formateado
   */
  static formatPhone(phone: string, format: 'international' | 'national' = 'international'): string {
    if (!phone) return '';

    const normalized = this.normalizePhone(phone);

    // Para formato internacional: +XX XXX XXX XXXX
    if (format === 'international' && normalized.startsWith('+')) {
      // Asumir que ya está formateado internacionalmente
      return normalized;
    }

    // Para números nacionales (sin código de país)
    if (normalized.length === 10) {
      return `+${normalized}`;
    }

    return normalized;
  }
}
