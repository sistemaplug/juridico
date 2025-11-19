import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
  async buscarEnderecoPorCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');

    // 1. Tentativa via ViaCEP
    const viaCepUrl = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    try {
      const { data } = await axios.get(viaCepUrl);

      if (!data.erro && (data.logradouro || data.bairro)) {
        return {
          cep: data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        };
      }
    } catch (error) {
      // ignorar erro e tentar a BrasilAPI
    }

    // 2. Tentativa via BrasilAPI
    const brasilApiUrl = `https://brasilapi.com.br/api/cep/v1/${cepLimpo}`;
    try {
      const { data } = await axios.get(brasilApiUrl);

      return {
        cep: data.cep,
        logradouro: data.street || '',
        complemento: '',
        bairro: data.neighborhood || '',
        cidade: data.city,
        estado: data.state,
      };
    } catch (error) {
      throw new NotFoundException('CEP não encontrado nas fontes disponíveis');
    }
  }
}
