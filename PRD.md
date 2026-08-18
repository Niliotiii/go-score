# GoScore - Documento de Requisitos de Produto (PRD)

## 1. Visão Geral do Produto
* **Nome do Produto:** **GoScore**
* **Objetivo:** Fornecer um aplicativo frontend, leve, rápido e *mobile-first* para marcação de pontos em jogos e competições casuais. O app dispensa qualquer infraestrutura de backend, operando integralmente no dispositivo do usuário.
* **Público-Alvo:** Praticantes de esportes amadores, organizadores de partidas recreativas, e usuários que buscam um marcador versátil e intuitivo sem burocracia de cadastro.

---

## 2. Objetivos e Métricas de Sucesso
* **Velocidade de Ação:** Permitir que o usuário configure uma partida e comece a pontuar em menos de 10 segundos.
* **Fluidez e Usabilidade (*UX/UI*):** Eliminar toques acidentais através de gestos otimizados para telas sensíveis ao toque (*touch-first*).
* **Confiabilidade:** Funcionamento 100% offline via armazenamento local (*localStorage*).

---

## 3. Requisitos Funcionais

### 3.1. Menu Principal (Home)
* **RF01:** Exibir a identidade visual e o hub de acesso do **GoScore** para o modo de placar genérico.
* **RF02:** Botão de acesso rápido para iniciar uma nova partida.

### 3.2. Tela de Configuração da Partida (Setup)
* **RF03:** Permitir a definição de **2 times** no escopo inicial.
* **RF04:** Para cada time, customizar:
  * **Nome:** Campo de texto livre.
  * **Cor:** Seletor de cores para preencher dinamicamente a área do time.
  * **Ícone:** Escolha de um ícone representativo através de uma grade pré-definida.
* **RF05:** Configurações de regras e interações:
  * **Ativar/Desativar Arrastar para Cima (+3 pontos):** Alternador (Toggle) booleano.

### 3.3. Tela do Placar (Interface Principal)
* **Layout Lado a Lado:** A tela é dividida verticalmente em duas colunas simétricas, uma para cada time, ocupando o restante da tela em modo retrato (*portrait*).
* **Gestos de Pontuação (Por Time):**
  * **RF06:** **Toque rápido (Tap):** Adiciona `+1 ponto` ao placar do respectivo time.
  * **RF07:** **Arrastar para cima (Swipe Up):** Adiciona `+3 pontos` (condicionado à ativação nas configurações).
  * **RF08:** **Arrastar para baixo (Swipe Down):** Subtrai `-1 ponto` (correção rápida).
* **Controle de Sets / Períodos:**
  * **RF09:** Contador visual de sets/períodos vencidos por cada time no topo da coluna.
* **Cronômetro Integrado (Barra Superior):**
  * **RF10:** Exibição do tempo decorrido no formato `MM:SS`.
  * **RF11:** **Toque curto:** Inicia (*Start*) ou Pausa (*Pause*) o cronômetro.
  * **RF12:** **Toque longo (Pressionar por 5 segundos):** Reseta o cronômetro para `00:00` (com feedback visual de progresso).
* **Ações de Rodapé (Footer):**
  * **RF13:** Botão **"Inverter Lados"**: Altera a posição visual dos times na tela (útil para troca de quadra/campo).
  * **RF14:** Botão **"Zerar Placar"**: Reseta os pontos e sets de ambos os times (exige modal de confirmação para evitar perdas acidentais).

---

## 4. Requisitos Não-Funcionais

* **RNF01 (Plataforma & Arquitetura):** Aplicação puramente frontend desenvolvida em React/Vue com Vite, utilizando Tailwind CSS para estilização rápida e responsiva.
* **RNF02 (Mobile-First):** Layout otimizado estritamente para visualização em smartphones, com desativação de seleção de texto nativa (`user-select: none`) e prevenção de zoom indesejado por gestos rápidos (`touch-action: manipulation`).
* **RNF03 (Performance):** Renderização isolada de componentes para que a atualização do cronômetro ou pontuação não cause gargalos na interface.
* **RNF04 (Persistência Leve):** Uso opcional de `localStorage` para recuperar o estado da partida atual caso o navegador seja fechado acidentalmente.

---

## 5. Fora do Escopo (Versão MVP)
* Histórico salvo de partidas antigas em banco de dados.
* Sistema de cadastro de usuários e login.
* Compartilhamento direto de resultados via API nativa de redes sociais.