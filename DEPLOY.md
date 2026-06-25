# Deploy & Firebase checklist

Este arquivo reúne os passos necessários para garantir que o projeto funcione localmente e no Vercel.

1. Variáveis de ambiente
- Adicione as variáveis `NEXT_PUBLIC_FIREBASE_*` no painel de Environment Variables do Vercel com os mesmos valores do `.env.local` (sem aspas).
- No ambiente local, mantenha ` .env.local` com as mesmas chaves.

2. Firebase
- Console Firebase -> Authentication: habilitar Email/Password e Google Sign-In.
- Console Firebase -> Firestore: criar a base de dados (modo de teste ou regras adequadas para o trabalho).
- Console Firebase -> Project settings -> General: confirme os valores `apiKey`, `authDomain`, `projectId`, `appId`.

3. Regras de Firestore recomendadas (simples para avaliações):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Deploy no Vercel
- Conectar repositório e criar um novo projeto no Vercel.
- Em Settings -> Environment Variables, adicionar todas as `NEXT_PUBLIC_FIREBASE_*` (Production/Preview/Development conforme necessário).
- Fazer deploy; acessar `/register` e `/login` para testar fluxo de criação de conta e `/dashboard` para testar tarefas.

5. Observações
- Valores nas variáveis NÃO devem conter aspas.
- Se o domínio `storageBucket` terminar em `.app`, confirme no console Firebase. Em muitos casos o formato é `PROJECT_ID.appspot.com`.
- Se houver problema com `signInWithPopup` no Vercel, verifique o domínio autorizado em Authentication -> Sign-in method -> Authorized domains.

6. Testes locais
- Executar em local:

```bash
npm install
npm run dev
```

- Acesse `http://localhost:3000` e verifique o registro/login e o dashboard.
