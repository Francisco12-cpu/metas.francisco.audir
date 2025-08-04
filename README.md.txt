# Sistema de Metas 12 Semanas

Um site pessoal para organização e acompanhamento de metas em um ciclo de 12 semanas, desenvolvido com HTML, CSS e JavaScript vanilla para hospedagem no GitHub Pages.

## 📋 Sobre o Projeto

Este é um sistema completo de gerenciamento pessoal de metas que permite:
- Acompanhar metas durante 12 semanas (de 3 de agosto a 26 de outubro de 2025)
- Escrever relatórios diários com indicador de humor
- Visualizar progresso com gráficos e estatísticas
- Organizar metas por categorias e semanas
- Funcionar completamente offline usando localStorage

## 🚀 Funcionalidades

### 🗓️ Calendário de 12 Semanas
- Gerado automaticamente a partir de 3 de agosto de 2025
- Dias clicáveis para acesso aos relatórios diários
- Destaque visual da semana atual
- Indicadores visuais para dias com relatórios preenchidos

### 🎯 Gerenciamento de Metas
- Cadastro de metas com título, descrição e categoria
- Atribuição de metas a semanas específicas
- Controle de status (pendente/concluído)
- Filtros por categoria e status
- Edição e exclusão de metas

### ✍️ Relatórios Diários  
- Área de texto para registro das atividades do dia
- Seletor de humor com emojis (1-5)
- Salvamento automático no navegador
- Contador de dias com relatório preenchido

### 📊 Visualização de Progresso
- Percentual de metas concluídas
- Indicador de consistência nos relatórios
- Progresso semanal em gráfico de barras
- Estatísticas gerais do ciclo

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo com Grid e Flexbox
- **JavaScript Vanilla**: Toda a lógica da aplicação
- **localStorage**: Persistência de dados offline
- **Feather Icons**: Ícones vetoriais
- **Google Fonts**: Tipografia (Inter)

## 📦 Como Usar

### 1. Hospedagem Gratuita no GitHub Pages

**Passo a Passo Simples:**

1. **Criar conta no GitHub** (se não tiver):
   - Acesse: https://github.com
   - Clique em "Sign up" e crie sua conta gratuita

2. **Criar novo repositório**:
   - Após fazer login, clique no botão verde "New" ou "+"
   - Nome do repositório: `metas-12-semanas`
   - Deixe como "Public"
   - Marque "Add a README file"
   - Clique "Create repository"

3. **Fazer upload dos arquivos**:
   - No seu repositório, clique "uploading an existing file"
   - Arraste ou selecione os arquivos: `index.html`, `style.css`, `script.js`
   - Escreva uma mensagem como "Adicionar site de metas"
   - Clique "Commit changes"

4. **Ativar GitHub Pages**:
   - Vá em "Settings" (no menu do repositório)
   - Role para baixo até "Pages"
   - Em "Source", escolha "Deploy from a branch"
   - Selecione "main" em branch
   - Clique "Save"

5. **Seu site estará disponível em**:
   `https://seu-usuario-github.github.io/metas-12-semanas`

### 2. Clonando o Repositório Localmente (opcional)
```bash
git clone https://github.com/seu-usuario/metas-12-semanas.git
cd metas-12-semanas