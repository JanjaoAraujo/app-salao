SALÃO PRO - VERSÃO MAIS COMPLETA

PASTAS:
- frontend = app Expo React Native
- backend = API FastAPI + MongoDB

COMO RODAR:

1) BACKEND
- Instale Python
- Entre na pasta backend
- Rode:
  pip install -r requirements.txt
  uvicorn main:app --reload

2) MONGODB
- Instale o MongoDB Community Server
- Deixe o MongoDB iniciado

3) FRONTEND
- Instale Node.js
- Entre na pasta frontend
- Rode:
  npm install
  npx expo start

4) IMPORTANTE
- No arquivo frontend/services/api.js
- Troque SEU_IP pelo IP do seu computador
- Exemplo: http://192.168.0.10:8000

OBSERVAÇÃO HONESTA:
Esse projeto já está bem mais completo e com cara profissional.
Mesmo assim, para rodar no seu celular e virar APK, ainda precisa:
- instalar dependências
- rodar backend
- configurar o IP
