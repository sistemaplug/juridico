import "vuetify/styles";
import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import { pt } from "vuetify/locale";

// Definição do tema claro
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#1E90FF", // RGB: 30, 144, 255 (Azul Claro)
    activate: "#0d47a1",
    secondary: "#005580", // RGB: 0, 85, 128 (Azul Médio Escuro)
    register: "#dbead5",
    accent: "#ff6f00", // RGB: 16, 185, 129 (Verde Claro)
    error: "#cc0000", // RGB: 204, 0, 0 (Vermelho Escuro)
    info: "#006699", // RGB: 0, 102, 153 (Azul Escuro)
    success: "#009933", // RGB: 0, 153, 51 (Verde Médio)
    warning: "#FFCC33", // RGB: 255, 204, 51 (Amarelo Claro)
    grayPrimary: "#F5F5F5", // RGB: 245, 245, 245 (Cinza Claro)
    graySecondary: "#A0A0A0", // RGB: 160, 160, 160 (Cinza Médio)

    // Cor personalizada para o fundo de cards
    cardBackground: "#f5f5f5", // equivalente ao bg-grey-lighten-4
  },
};

// Definição do tema escuro
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#0d47a1", // RGB: 13, 71, 161 (Azul Escuro)
    secondary: "#1e88e5", // RGB: 30, 136, 229 (Azul Claro Médio)
    accent: "#ff6f00", // RGB: 255, 111, 0 (Laranja Forte)
    error: "#ef5350", // RGB: 239, 83, 80 (Vermelho Médio)
    info: "#42a5f5", // RGB: 66, 165, 245 (Azul Claro)
    success: "#4caf50", // RGB: 76, 175, 80 (Verde Médio)
    warning: "#ffd54f", // RGB: 255, 213, 79 (Amarelo Claro)
  },
};

// Criação da instância do Vuetify
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
  locale: {
    locale: "pt", // Define o idioma padrão como português
    messages: { pt },
  },
});
