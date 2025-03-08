# AUKT - Plataforma de Leilões Online

## Visão Geral

AUKT é uma plataforma completa de leilões online desenvolvida com React e Vite, oferecendo uma experiência rica e interativa para anunciantes e clientes. O sistema permite a criação, gerenciamento e participação em leilões em tempo real, com recursos avançados de lances automáticos, personalização de interface e gestão de produtos.

## Tecnologias Principais

- **React** - Biblioteca para construção de interfaces
- **Vite** - Build tool para desenvolvimento rápido
- **Redux Toolkit** - Gerenciamento de estado global
- **Socket.io** - Comunicação em tempo real
- **Axios** - Cliente HTTP para requisições à API
- **Tailwind CSS** - Framework CSS para estilização
- **Framer Motion** - Biblioteca para animações
- **Swiper** - Componente de carrossel
- **Material UI** - Componentes de interface

## Arquitetura do Projeto

### Módulo de Anunciante (Advertiser)

O módulo de anunciante é o coração administrativo da plataforma, permitindo:

- Criação e gerenciamento de leilões
- Upload e organização de produtos
- Configuração de datas e grupos de leilão
- Monitoramento de lances em tempo real
- Gestão de arrematantes e cartelas
- Visualização de estatísticas e relatórios
- Personalização da interface da loja virtual

Este módulo foi projetado com foco na experiência do usuário administrativo, oferecendo controles intuitivos e fluxos de trabalho eficientes para gerenciar todo o ciclo de vida dos leilões.

### Gerenciamento de Estado com Redux

A aplicação utiliza Redux Toolkit para gerenciamento de estado global, com uma estrutura organizada em features:

- **auct** - Gerenciamento de leilões e suas propriedades
- **product** - Controle de produtos e uploads
- **Bids** - Gerenciamento de lances
- **template** - Personalização da interface da loja
- **errors** - Tratamento centralizado de erros
- **theme** - Configurações de tema da plataforma

Esta abordagem modular permite um controle preciso do estado da aplicação, facilitando a manutenção e escalabilidade do código.

### Home - Interface Personalizada

O módulo Home representa a interface pública personalizada para cada anunciante, oferecendo:

- Templates personalizáveis com diferentes layouts
- Carrosséis de produtos em destaque
- Galeria de produtos com filtros avançados
- Página de detalhes do produto com sistema de lances
- Integração com WebSockets para atualizações em tempo real
- Adaptação responsiva para diferentes dispositivos

A arquitetura da Home foi projetada para ser altamente personalizável, permitindo que cada anunciante tenha sua própria identidade visual enquanto mantém a funcionalidade completa da plataforma.

### Floor - Ambiente de Leilão ao Vivo

O módulo Floor é o ambiente onde os leilões acontecem em tempo real:

- Interface imersiva para participação nos leilões
- Sistema de cronômetro sincronizado
- Visualização de lances em tempo real
- Animações e feedback visual para ações do usuário
- Suporte a lances automáticos
- Notificações de vencedores

## Recursos Avançados

- **WebSockets** para comunicação em tempo real
- **Lances automáticos** com configuração personalizada
- **Personalização completa** da interface da loja
- **Sistema de cartelas** para gerenciamento pós-leilão
- **Envio de emails** para confirmação de arrematantes
- **Responsividade** para diferentes dispositivos
- **Animações fluidas** para melhor experiência do usuário

## Segurança

- Autenticação JWT para controle de acesso
- Validação de sessões em tempo real
- Proteção contra lances inválidos
- Sistema de advertências e suspensões para usuários

---

Desenvolvido e revisado por DanielMctavish
