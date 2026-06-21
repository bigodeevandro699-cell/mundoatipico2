/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity } from '../types';

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Caixa Sólida de Sensações',
    description: 'Exploração tátil de texturas ocultas dentro de uma caixa adaptada para familiarização e autorregulação sensorial.',
    therapeuticObjective: 'Diminuir a hipersensibilidade tátil, promover exploração ativa e organização sensorial.',
    ageRange: '2 a 6 anos',
    difficulty: 'Fácil',
    estimatedTime: '15 min',
    materialsNeeded: [
      'Uma caixa de papelão com dois furos de tamanho adequado para as mãos',
      'Retalhos de tecidos (seda, feltro, lixa suave, algodão)',
      'Feijões secos, massinha de modelar ou esponja macia',
      'Pequenos brinquedos favoritos da criança'
    ],
    stepByStep: [
      'Faça dois furos redondos na lateral da caixa de papelão onde a criança colocará as mãos sem olhar para dentro.',
      'Coloque diferentes texturas e pequenos objetos dentro da caixa.',
      'Sente-se de forma confortável na altura dos olhos da criança e convide-a a colar as mãos na caixa ("O que será que tem ali dentro?").',
      'Instigue a criança a tocar nos materiais e adivinhar as texturas, guiando as palavras em tom calmante e afetivo.',
      'Deixe que ela retire o objeto que mais lhe causou curiosidade ou conforto, comemorando e validando a conquista!'
    ],
    expectedBenefits: [
      'Fomenta o registro sensorial adequado',
      'Estimula a curiosidade científica e o vocabulário sensorial ("macio", "áspero")',
      'Serve de ferramenta calmante em momentos de sobrecarga visual'
    ],
    extraTips: 'Se a criança expressar aversão inicial a tocar algo às escuras, faça com a caixa aberta primeiro para que ela veja que é seguro e divertido.',
    category: 'Estimulação sensorial',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-2',
    title: 'Pintura Simétrica com Plástico Bolha',
    description: 'Prática de pintura onde colocamos tinta em uma folha envolvida por plástico bolha, permitindo sentir as bolhas estourando sem o contato direto pegajoso da tinta.',
    therapeuticObjective: 'Desenvolvimento do refinamento motor fino e estímulo da pressão plantar/palmar em crianças sensíveis a texturas úmidas.',
    ageRange: '3 a 8 anos',
    difficulty: 'Médio',
    estimatedTime: '20 min',
    materialsNeeded: [
      'Papel cartão ou folha de papel grossa',
      'Tinta guache de cores vibrantes (azul, amarelo, verde, vermelho)',
      'Fita adesiva',
      'Pedaço de plástico bolha de tamanho adequado',
      'Fita crepe para fixar na mesa'
    ],
    stepByStep: [
      'Pingue gotas de tintas variadas em diferentes partes do papel cartão.',
      'Cubra delicadamente o papel com o plástico bolha (com as bolhinhas para cima) e prenda firmemente todas as bordas na mesa usando fita crepe.',
      'Mostre à criança como pressionar e esparramar a tinta sob o plástico bolha, sentindo as bolhas estourando sob os dedinhos.',
      'Siga o interesse dela: misturar cores, desenhar caminhos com o dedinho ou dar batidinhas rítmicas.',
      'Retire cuidadosamente o plástico bolha depois da brincadeira e coloque a arte única para secar.'
    ],
    expectedBenefits: [
      'Prensagem controlada dos dedos promovendo propriocepção',
      'Experiência tátil prazerosa com barreira de proteção para aversão a sujeira',
      'Estudo visual da mistura e fusão das cores primárias'
    ],
    extraTips: 'Essa atividade gera excelente retorno proprioceptivo. Você pode colar o conjunto no chão para que a criança teste pisar descalça, promovendo equilíbrio!',
    category: 'Coordenação motora fina',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-3',
    title: 'Termômetro das Emoções Visuais',
    description: 'Criação de um painel visual personalizado onde a criança pode identificar, nomear e expressar sua regulação emocional no momento.',
    therapeuticObjective: 'Promover a autoconsciência de estados de humor interno, favorecendo a autorregulação e reduzindo crises de frustração.',
    ageRange: '4 a 12 anos',
    difficulty: 'Médio',
    estimatedTime: '25 min',
    materialsNeeded: [
      'Papel sulfite colorido ou cartolina',
      'Canetinhas coloridas grandes',
      'Pregador de roupas de madeira personalizado',
      'Imagens impressas ou desenhadas de carinhas (Feliz/Verde, Confortável/Azul, Agitado/Amarelo, Bravo/Vermelho)'
    ],
    stepByStep: [
      'Desenhe uma faixa com quatro divisões de cores: Verde (corpo calmo), Azul (sonolento ou triste, precisando de aconchego), Amarelo (eufórico ou ansioso), Vermelho (irritado ou sobrecarregado).',
      'Cole as carinhas representativas em cada faixa de cor.',
      'Escreva o nome da criança no pregador de madeira.',
      'Coloque o termômetro em local visível na sala ou quarto.',
      'Durante o dia, incentive a criança a colocar o pregador no quadrante correspondente a como ela está se sentindo ("Como está seu termômetro agora?"), validando seus sentimentos com abraços e tom neutro.'
    ],
    expectedBenefits: [
      'Externaliza sentimentos intangíveis de forma concreta e tátil',
      'Fornece uma ferramenta visual sem pressão de fala obrigatória para momentos de desregulação',
      'Ensina empatia e automonitoramento'
    ],
    extraTips: 'Terapeutas e pais também devem mover seu próprio pregador durante o dia dizendo: "O papai está um pouco cansado hoje (azul), vou sentar e ler um pouco". Modelar o comportamento é a forma mais poderosa de aprendizado.',
    category: 'Regulação emocional',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-4',
    title: 'Dado de Conversação Social',
    description: 'Jogo interativo com um dado gigante contendo comandos simples, amigáveis e visuais para iniciar pequenos diálogos compartilhados.',
    therapeuticObjective: 'Estimular a reciprocidade social, manutenção de contato visual natural e turnos na conversação cotidiana.',
    ageRange: '5 a 10 anos',
    difficulty: 'Médio',
    estimatedTime: '15 min',
    materialsNeeded: [
      'Uma caixa de papelão em formato de cubo (ou molde impresso)',
      'Imagens simples representativas de temas de diálogo (animais, comida, passatempos, brincadeiras, família)',
      'Cola e tesoura'
    ],
    stepByStep: [
      'Encape o cubo de papelão de modo uniforme.',
      'Cole uma ilustração temática em cada face do cubo (Ex: um gatinho, um prato de comida, um videogame, um coração, etc.).',
      'Sente com a criança em círculo ou de frente para ela e jogue o dado.',
      'O tema que cair para cima dita a pergunta rápida. Se for o gatinho: "Qual seu bicho favorito?" ou "Que som o cachorro faz?".',
      'Ensine a alternância das respostas: "Agora é a sua vez de jogar o dado e perguntar para a mamãe!"'
    ],
    expectedBenefits: [
      'Favorece o desenvolvimento do diálogo prático pragmático',
      'Ensina a esperar a própria vez respeitando o tempo de resposta do parceiro social',
      'Estreita conexões emocionais de forma estruturada e previsível'
    ],
    extraTips: 'Use pictogramas claros e simplificados para crianças não verbais, permitindo que respondam apontando para cartões de comunicação alternativa (PECS).',
    category: 'Habilidades sociais',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-5',
    title: 'Siga a Linha das Aventuras',
    description: 'Trilha no chão traçada de forma colorida com diferentes tipos de fita, desafiando a criança a caminhar mantendo o equilíbrio e respondendo a estímulos corporais.',
    therapeuticObjective: 'Trabalhar planejamento motor, consciência espacial, coordenação motora ampla e vestibulares.',
    ageRange: '3 a 10 anos',
    difficulty: 'Fácil',
    estimatedTime: '15 min',
    materialsNeeded: [
      'Fita adesiva colorida (fita crepe colorida ou fita isolante)',
      'Espaço livre no corredor ou sala'
    ],
    stepByStep: [
      'Cole fitas no chão fazendo caminhos variados: uma linha reta amarela, um caminho em zigue-zague vermelho e uma curva azul suave.',
      'Mostre como andar sobre a fita colocando um pé exatamente na frente do outro, como um equilibrista de circo.',
      'Adicione desafios divertidos ao longo da linha: "Ao passar pelo vermelho, balance os braços como um passarinho" ou "No amarelo, dê pulinhos de sapo".',
      'Acompanhe o percurso aplaudindo cada etapa e ajudando com as mãos se o equilíbrio falhar.'
    ],
    expectedBenefits: [
      'Estimula o sistema vestibular e proprioceptivo corporal',
      'Auxilia no desenvolvimento do foco e planejamento de múltiplos passos motores consecutivamente',
      'Gasto de energia física de forma canalizada e divertida dentro do lar'
    ],
    extraTips: 'Você pode colocar pequenos obstáculos como almofadas baixas para o alto-relevo ou exigir carregar uma colher com uma bolinha de papel, incrementando o desafio motriz.',
    category: 'Coordenação motora ampla',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-6',
    title: 'Desafio Fantástico do Pareamento Visual de Cores',
    description: 'Organização de objetos do cotidiano em bandejas ou círculos coloridos correspondentes, oferecendo ordem e acolhimento estruturado.',
    therapeuticObjective: 'Aprimorar a categorização cognitiva, discriminação visual fina e o raciocínio matemático inicial.',
    ageRange: '2 a 7 anos',
    difficulty: 'Fácil',
    estimatedTime: '10 min',
    materialsNeeded: [
      'Copos plásticos coloridos ou pedaços de papel colorido flutuantes',
      'Variados objetos pequenos colecionáveis (prendedores de cabelo, blocos Lego, tampinhas, botões grandes correspondentes às cores dos copos)'
    ],
    stepByStep: [
      'Posicione os recipientes ou folhas coloridas de forma alinhada diante da criança.',
      'Misture todos os pequenos objetos coloridos em uma tigela única central.',
      'Mostre o exemplo devagar: "Olha, a tampinha azul vai morar na casinha azul!". Acesse o raciocínio sem falar muito, utilizando gestos limpos.',
      'Permita que a criança execute e sinta o acolhimento relaxante ao ordenar o caos em categorias harmônicas no seu próprio tempo.'
    ],
    expectedBenefits: [
      'Promove estruturação visual previsível, altamente reconfortante para crianças autistas',
      'Auxilia no desenvolvimento cognitivo de igualdade e diferença de critérios',
      'Melhora a preensão em pinça ao segurar os pequenos objetos'
    ],
    extraTips: 'A organização espontânea por cor ou tamanho é uma característica frequente e satisfatória no TEA. Use essa predileção natural para engajar a criança de forma terapêutica.',
    category: 'Percepção visual',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-7',
    title: 'Soprando Barquinhos de Esponja',
    description: 'Jogo terapêutico em uma bacia com água onde a criança usa canudos ou o próprio fôlego para soprar barquinhos feitos de esponja para o outro lado.',
    therapeuticObjective: 'Trabalhar planejamento oral, fortalecimento dos músculos bucinadores, regulação respiratória e calma comportamental.',
    ageRange: '3 a 8 anos',
    difficulty: 'Fácil',
    estimatedTime: '15 min',
    materialsNeeded: [
      'Uma bacia baixa e larga cheia de água',
      'Esponjas de pia limpas cortadas em formas de barco com palitos e velas de papel colorido',
      'Canudos biodegradáveis ou de silicone'
    ],
    stepByStep: [
      'Monte a bacia de água de forma segura sobre uma mesa impermeável ou cercada de toalhas no tapete.',
      'Mostre à criança como assoprar e empurrar o ar devagar pela boca, produzindo ondas na água.',
      'Introduza os barquinhos de esponja alegres na água.',
      'Entregue o canudo ou peça para soprar diretamente para que o barquinho navegue até a outra margem.',
      'Transforme em brincadeira com turnos: "Agora é a tempestade forte, agora é a brisa leve do mar!".'
    ],
    expectedBenefits: [
      'Trabalha a fonoarticulação e mobilidade labiopalatina de forma lúdica',
      'O controle respiratório atua diretamente no sistema parassimpático, ideal para acalmar a ansiedade',
      'Desenvolve causa e efeito físico de forma imediata'
    ],
    extraTips: 'Ideal para fazer antes de rotinas que possam gerar ansiedade ou transições de tarefas, pois a respiração programada reduz respostas de luta ou fuga.',
    category: 'Linguagem',
    isFavorite: false,
    isCompleted: false
  },
  {
    id: 'act-8',
    title: 'Autonomia: Calçando Meus Sapatinhos',
    description: 'Atividade dividida em microetapas didáticas apoiadas por pictogramas para aprender a colocar meias e calçar calçados sem frustração.',
    therapeuticObjective: 'Promover habilidades práticas da vida diária, autogerenciamento, planejamento motor sequencial e a autoestima infantil.',
    ageRange: '4 a 9 anos',
    difficulty: 'Médio',
    estimatedTime: '15 min',
    materialsNeeded: [
      'Meias folgadas de tecidos maleáveis e cores contrastantes no calcanhar',
      'Sapatos de calçar sem cadarço (com velcro grande ou elástico)'
    ],
    stepByStep: [
      'Inicie a atividade quando não estiver próximo do horário de saídas urgentes para eliminar pressões temporais.',
      'Use a técnica do encadeamento reverso: coloque a meia quase toda no pé da criança e deixe apenas que ela faça o último puxão para cima, apoiando o sucesso imediato.',
      'Comemore muito a conquista dela!',
      'Vá gradualmente recuando a sua ajuda em dias seguidos: deixe que ela calce do calcanhar, depois que deslize o pé todo desde a ponta.',
      'Faça o mesmo jogo com calçados de tiras colantes (velcro). Incentive a fazer o som clássico do fecho abrindo e fechando de forma divertida.'
    ],
    expectedBenefits: [
      'Garante autonomia na rotina diária diminuindo a sobrecarga dos pais',
      'Desenvolve a força muscular das mãos e coordenação viso-motora bimanual',
      'Estabelece autoconfiança de eficácia e independência corporal'
    ],
    extraTips: 'Trabalhe o calçar calçados lúdicos ou meias de personagens divertidos para que a carga de esforço motor seja recompensada pelo aspecto divertido do vestuário.',
    category: 'Autonomia',
    isFavorite: false,
    isCompleted: false
  }
];
