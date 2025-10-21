# 🚀 Alpha Benchmark — Projeto de Testes Rápidos

Um site simples e responsivo com 4 testes de performance: Reação, Escrita, Memória e Clicks.

Inspirado em layouts modernos, o projeto conta com um painel central, header fixo, responsividade para dispositivos móveis, e suporte a tema claro/escuro.

## 📝 Resumo dos Testes

* **Teste de Reação:** Mede seu tempo de reação a uma mudança de cor.
* **Teste de Escrita:** Testa sua velocidade de digitação (WPM) em 30 segundos.
* **Teste de Memória:** Desafia sua memória de curto prazo com sequências numéricas.
* **Teste de Clicks:** Mede quantos clicks você consegue dar em 10 segundos.

## 📁 Estrutura do Projeto

### Páginas Principais
* `index.html` — Menu principal com links para todos os testes.
* `TesteReacao.html` — Página do teste de tempo de reação.
* `TesteEscrita.html` — Página do teste de digitação (3s de preparação, 30s de teste).
* `TesteMemoria.html` — Página do teste de memória de sequência.
* `TesteClicks.html` — Página do teste de clicks por segundo (CPS).

### Arquivos Importantes
* `style.css` — Contém toda a estilização, incluindo temas (claro/escuro) e responsividade.
* `script.js` — Controla a lógica de todos os testes, alternância de tema e o player de áudio.
* `background.mp3` — Música de fundo (opcional).
* `/assets/` — Diretório para ícones, imagens e vídeos utilizados.

## 🛠️ Como Executar Localmente

Você pode abrir o `index.html` diretamente, mas para garantir que tudo (como o áudio) funcione sem problemas de CORS, é recomendado usar um servidor local.

### Método 1: Servidor Local (Recomendado)

1.  Abra seu terminal e navegue até a pasta do projeto:
    ```bash
    cd /caminho/para/o/Projeto
    ```
2.  Inicie um servidor HTTP simples (requer Python 3):
    ```bash
    python3 -m http.server 8000
    ```
3.  Abra no seu navegador:
    * [http://localhost:8000](http://localhost:8000)

### Método 2: Abertura Direta

1.  Baixe o `.zip` do projeto e extraia a pasta.
2.  Encontre o arquivo `index.html` e clique duas vezes para abri-lo no seu navegador padrão.

## ✨ Funcionalidades Notáveis

* **Botão de Tema:** Alterna entre o tema escuro (padrão) e claro. A sua preferência fica salva no `localStorage` do navegador.
* **Botão de Música:** Inicia ou pausa a reprodução do áudio de fundo (`background.mp3`).
* **Responsividade:** O layout se adapta a telas de desktop e dispositivos móveis. O grid de testes passa para uma coluna única em telas pequenas.
* **Resultados:** As pontuações só são exibidas ao final de cada teste.

## 🚧 Problemas Conhecidos / Próximos Passos

* [ ] Implementar um placar competitivo (ranking) ou histórico local.
* [ ] Fazer ajustes finos de espaçamento em dispositivos móveis específicos.
* [ ] Refinar os tempos e a dificuldade dos testes (UX).

## 🤝 Contribuição

Alterações e melhorias são bem-vindas!
1.  Crie uma nova *branch* (`git checkout -b feature/sua-feature`).
2.  Faça seus *commits* (`git commit -m 'Adiciona nova feature'`).
3.  Envie para a *branch* (`git push origin feature/sua-feature`).
4.  Abra um *Pull Request*.

## 📜 Licença

Use este projeto como desejar.
