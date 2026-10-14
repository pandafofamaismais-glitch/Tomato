# Tomato Animes — projeto Java + HTML + CSS + JavaScript

Recriação visual inspirada na captura enviada: tema escuro, destaque principal, navegação, busca, cards de animes, notas e biblioteca.

## Requisitos
- JDK 17 ou superior
- Visual Studio Code (ou outro editor)

## Como executar
1. Extraia `tomato_animes_java.zip` para a Área de Trabalho.
2. No VS Code, abra a pasta `tomato_animes_java`.
3. Abra o terminal integrado (`Terminal > Novo Terminal`).
4. Execute:

```bash
javac -d out src/main/java/Main.java
java -cp out Main
```

5. Abra `http://localhost:8080` no navegador.

## Como assistir a vídeos
O projeto não inclui episódios de animes protegidos por direitos autorais. O player está preparado para reproduzir arquivos de vídeo que você tenha direito de usar.

1. Coloque os arquivos `.mp4` autorizados dentro de `public/videos/`.
2. Abra `public/js/app.js`.
3. No objeto `animeCatalog`, troque `video: ""` por, por exemplo, `video: "videos/meu-video.mp4"` para o anime correspondente.
4. Recarregue o site e clique em **Assistir agora**.

Você também pode usar links de fontes oficiais/autorizadas que permitam reprodução no navegador, definindo o campo `video` com a URL correspondente. Alguns serviços bloqueiam reprodução externa; nesses casos, use o site ou aplicativo oficial.

## Estrutura
- `src/main/java/Main.java` — servidor HTTP Java, serve os arquivos e suporta requisições de vídeo com Range.
- `public/index.html` — estrutura da página.
- `public/css/style.css` — aparência responsiva.
- `public/js/app.js` — catálogo, busca, cards, biblioteca e player.
- `public/videos/` — pasta para vídeos autorizados.
- `public/images/` — pasta para imagens locais, caso queira substituir as imagens ilustrativas.

## Observações
- O catálogo contém títulos de exemplo para reproduzir a organização visual da captura; não contém episódios completos.
- As imagens de capa são carregadas de URLs públicas ilustrativas e precisam de internet. Para um projeto totalmente offline, coloque imagens que você tenha direito de usar em `public/images/` e atualize os campos `image` em `app.js`.
- A biblioteca salva os itens no armazenamento local do navegador. Não há contas, banco de dados ou sincronização entre dispositivos.
