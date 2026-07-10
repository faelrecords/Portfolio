# Notas da Implementação Atual

## Modo escolhido

A versão entregue usa uma arquitetura **static-first** para funcionar integralmente no GitHub Pages:

- React e Vite para o frontend;
- JSON versionado como fonte de conteúdo;
- `localStorage` para rascunhos do editor;
- Web Crypto para validação local da credencial;
- GitHub Contents API para publicação;
- GitHub Actions para build e deploy.

## Diferença em relação à arquitetura de backend documentada

O plano técnico original prevê uma API Node.js externa, banco PostgreSQL e cookies HttpOnly. Essa continua sendo a solução recomendada para múltiplos administradores, permissões avançadas, auditoria completa e uploads grandes.

Nesta primeira entrega, o requisito de funcionar apenas ao colocar a pasta no GitHub Pages foi priorizado. Por isso:

- o login local não é uma fronteira de segurança de servidor;
- o token GitHub é a autorização real para escrita;
- o conteúdo é salvo em `public/content/site.json`;
- imagens enviadas pelo painel ficam incorporadas como Data URL e devem ser pequenas;
- arquivos grandes devem ser hospedados externamente e cadastrados por URL.

## Migração futura para API

Os componentes visuais e o formato de conteúdo podem ser mantidos. A migração exige substituir:

```text
src/lib/content.js
src/lib/adminAuth.js
src/lib/githubPublisher.js
```

por clientes HTTP conectados à API descrita em `API.md`.

## Limites recomendados

- imagem incorporada no JSON: até 1,5 MB;
- cards por coleção: até 50;
- FAQ: até 30 itens;
- evitar vídeos em Data URL;
- usar CDN ou object storage para arquivos de download grandes.
