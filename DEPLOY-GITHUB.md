# Publicação no GitHub Pages

## Opção recomendada — substituir os arquivos pelo navegador

1. Abra o repositório `https://github.com/faelrecords/Portfolio`.
2. Faça backup dos arquivos atuais.
3. Envie todo o conteúdo da pasta `Fael-Records-Portfolio` para a raiz do repositório.
4. Não envie a pasta `node_modules`.
5. Confirme o commit na branch `main`.
6. Abra **Settings → Pages**.
7. Em **Source**, selecione **GitHub Actions**.
8. Abra a aba **Actions** e acompanhe o workflow `Deploy GitHub Pages`.
9. Em **Settings → Pages**, mantenha o custom domain como `portfolio.vibecodex.pro`.
10. Ative **Enforce HTTPS** quando o GitHub liberar a opção.

## Opção por Git no computador

Clone o repositório existente:

```bash
git clone https://github.com/faelrecords/Portfolio.git
cd Portfolio
```

Copie todos os arquivos entregues para dentro da pasta clonada, substituindo os antigos. Depois:

```bash
npm install
npm run lint
npm run build
git add .
git commit -m "feat: implementar portfolio Vibecodex"
git push origin main
```

## DNS

Para o subdomínio, o provedor de DNS deve conter:

```text
Tipo: CNAME
Nome: portfolio
Destino: faelrecords.github.io
```

O domínio também deve estar configurado em **Settings → Pages → Custom domain**.

## Primeiro uso do painel

1. Acesse `https://portfolio.vibecodex.pro/adm/`.
2. Entre com a credencial configurada.
3. Edite o conteúdo.
4. Abra a seção **Publicar**.
5. Informe um Fine-grained Personal Access Token do GitHub.
6. Limite o token somente ao repositório `Portfolio`.
7. Conceda apenas `Contents: Read and write`.
8. Clique em **Publicar alterações**.

O painel atualiza `public/content/site.json`. O commit dispara o GitHub Actions automaticamente.

## Diagnóstico

### O site mostra 404

- confirme que o workflow concluiu sem erros;
- confirme que o Pages está usando GitHub Actions;
- teste as rotas com barra final: `/home/` e `/adm/`;
- confira o domínio personalizado nas configurações do repositório.

### O domínio abre o site antigo

- aguarde a propagação do deploy;
- faça recarregamento forçado com `Ctrl + F5`;
- confira se o último workflow publicou a branch `main`.

### A publicação pelo painel falha

- confirme o proprietário `faelrecords`;
- confirme o repositório `Portfolio`;
- confirme a branch `main`;
- confira a permissão `Contents: Read and write` do token;
- verifique se o token ainda não expirou.
