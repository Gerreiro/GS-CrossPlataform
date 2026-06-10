# 🚀 Space Mission Monitor

**Central de Monitoramento de Missões Espaciais**  
Disciplina: Cross-Platform Application Development  
Curso: Ciência da Computação — FIAP

---

## 👥 Integrantes

| Nome Completo | RM |
|---|---|
| _(Henry)_ | RM 565309 |
| _(Samuel)_ | RM 564435 |
> ⚠️ **Preencha a tabela acima com os dados reais antes de entregar.**

---

## 📱 Descrição

App mobile em **React Native + Expo** que simula uma central de monitoramento de missões espaciais. Funciona como o painel de controle de uma missão real, com visual temático e dados de sensores em tempo real.

---

## ✅ Funcionalidades Implementadas

| Requisito | Status |
|---|---|
| Dashboard com dados de sensores | ✅ |
| Alertas automáticos para parâmetros críticos | ✅ |
| Formulários com validação | ✅ |
| Navegação com Expo Router | ✅ |
| Persistência com AsyncStorage | ✅ |
| Gerenciamento de estado com Context API | ✅ |

### 📡 Dashboard
- Exibe 8 sensores: Energia, Temperatura, Oxigênio, Pressão, Radiação, Estabilidade Orbital, Comunicação e Combustível
- Cada sensor tem barra de progresso, indicador de status (Normal / Atenção / Crítico) e animação pulsante para estados críticos
- Botão para simular novas leituras de sensores

### 🚨 Alertas Automáticos
- Geração automática de alertas quando sensores atingem limiares de `warning` ou `critical`
- Reconhecimento individual ou em lote
- Badge de contagem de alertas não reconhecidos

### ⚙️ Configuração com Validação
- Formulário de dados da missão (nome, comandante, data de lançamento, planeta-alvo, tripulação, notas)
- Validações: campos obrigatórios, formato de data `DD/MM/AAAA`, limites numéricos
- Formulário auxiliar para atualização manual de sensores

### 📋 Registros
- Resumo completo da missão
- Última leitura de todos os sensores com timestamp
- Estatísticas de alertas
- Log dos 20 alertas mais recentes

---

## 🗂 Estrutura do Projeto

```
space-mission-monitor/
├── app/
│   ├── _layout.tsx      # Tabs + MissionProvider (Expo Router)
│   ├── index.tsx        # Dashboard
│   ├── alerts.tsx       # Central de Alertas
│   ├── config.tsx       # Configuração + Formulários
│   └── logs.tsx         # Registros da Missão
├── context/
│   └── MissionContext.tsx  # Context API + AsyncStorage
├── app.json
├── package.json
└── babel.config.js
```

---

## 🛠 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo Go no celular **ou** emulador Android/iOS

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/space-mission-monitor.git
cd space-mission-monitor

# 2. Instale as dependências
npm install

# 3. Inicie o servidor Expo
npx expo start
```

### Rodar no dispositivo
- **Celular físico**: escaneie o QR code com o app Expo Go
- **Android Emulator**: pressione `a` no terminal
- **iOS Simulator**: pressione `i` no terminal (macOS necessário)

---

## 🔧 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) ~51
- [Expo Router](https://expo.github.io/router/) ~3.5 — navegação por arquivos
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) — persistência local
- Context API (nativo do React) — estado global

---

## 📊 Limiares dos Sensores

| Sensor | Atenção | Crítico |
|--------|---------|---------|
| Energia | < 40% | < 20% |
| Temperatura | > 30°C | > 40°C |
| Oxigênio | < 70% | < 50% |
| Pressão | < 90 kPa | < 80 kPa |
| Radiação | > 1.0 mSv/h | > 2.5 mSv/h |
| Est. Orbital | < 60% | < 40% |
| Comunicação | < 50% | < 20% |
| Combustível | < 30% | < 15% |
