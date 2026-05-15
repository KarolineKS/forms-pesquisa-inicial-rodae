export type Option = { value: string; label: string; blocking?: boolean };

export type Question = {
  id: string;
  type: 'single' | 'scale' | 'textarea' | 'text' | 'tel';
  text: string;
  subtext?: string;
  options?: Option[];
  showIf?: (a: Record<string, any>) => boolean;
  optional?: boolean;
  placeholder?: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 'P0',
    type: 'single',
    text: 'Qual é a sua idade?',
    options: [
      { value: 'menor18', label: 'Menor de 18 anos', blocking: true },
      { value: '18-24', label: '18 a 24 anos' },
      { value: '25-34', label: '25 a 34 anos' },
      { value: '35-44', label: '35 a 44 anos' },
      { value: '45-54', label: '45 a 54 anos' },
      { value: '55+', label: '55 anos ou mais' },
    ],
  },
  {
    id: 'P1',
    type: 'single',
    text: 'Qual destas situações mais combina com sua rotina hoje?',
    options: [
      { value: 'app_transporte', label: 'Trabalho com aplicativo de transporte (Uber, 99, InDriver)' },
      { value: 'delivery', label: 'Trabalho com delivery (iFood, Rappi, Loggi)' },
      { value: 'trabalho_profissional', label: 'Uso veículo para trabalho ou profissão' },
      { value: 'viajante', label: 'Viajo de vez em quando, a passeio ou a trabalho' },
      { value: 'nao_dirige', label: 'Não dirijo no dia a dia' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PR1',
    type: 'single',
    text: 'O veículo que você usa para trabalhar é:',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'proprio', label: 'Próprio' },
      { value: 'alugado_plataforma', label: 'Alugado de locadora ou plataforma' },
      { value: 'alugado_particular', label: 'Alugado de pessoa particular' },
      { value: 'emprestado', label: 'Emprestado de família ou amigo' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PR2_nota',
    type: 'scale',
    text: 'De 0 a 10, como é a experiência alugando esse veículo para trabalhar?',
    showIf: (a) => ['alugado_plataforma', 'alugado_particular'].includes(a.PR1),
  },
  {
    id: 'PR2_texto',
    type: 'textarea',
    text: 'O que pesou nessa nota?',
    showIf: (a) => ['alugado_plataforma', 'alugado_particular'].includes(a.PR1),
    placeholder: 'Escreva com suas palavras...',
  },
  {
    id: 'PR3',
    type: 'textarea',
    text: 'Já considerou alugar veículo para trabalhar em vez de usar o seu? Se sim, o que te impediu?',
    showIf: (a) => a.PR1 === 'proprio' && ['app_transporte', 'delivery'].includes(a.P1),
    optional: true,
    placeholder: 'Opcional',
  },
  {
    id: 'P2',
    type: 'single',
    text: 'Em situações em que você poderia alugar um veículo, o que faz mais sentido?',
    options: [
      { value: 'carro', label: 'Carro' },
      { value: 'moto', label: 'Moto' },
      { value: 'ambos', label: 'Pode ser qualquer um' },
      { value: 'nenhum', label: 'Não me vejo alugando' },
    ],
  },
  {
    id: 'A1',
    type: 'single',
    text: 'Quando foi a última vez que precisou de um carro que não era seu?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2),
    options: [
      { value: '6m', label: 'Nos últimos 6 meses' },
      { value: '6m-2a', label: 'Há 6 meses a 2 anos' },
      { value: '2a+', label: 'Há mais de 2 anos' },
      { value: 'nunca', label: 'Nunca' },
    ],
  },
  {
    id: 'A2',
    type: 'single',
    text: 'O que você fez nessa situação?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca',
    options: [
      { value: 'locadora_grande', label: 'Aluguei em locadora grande (Localiza, Movida, Unidas)' },
      { value: 'locadora_pequena', label: 'Aluguei em locadora pequena local' },
      { value: 'particular_facebook', label: 'Aluguei com particular pelo Facebook ou indicação' },
      { value: 'emprestado', label: 'Peguei emprestado' },
      { value: 'uber', label: 'Usei Uber ou 99' },
      { value: 'desisti', label: 'Desisti ou adaptei' },
    ],
  },
  {
    id: 'A3_nota',
    type: 'scale',
    text: 'De 0 a 10, como foi essa experiência?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca',
  },
  {
    id: 'A3_texto',
    type: 'textarea',
    text: 'O que pesou nessa nota?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca',
    placeholder: 'Escreva com suas palavras...',
  },
  {
    id: 'A3b',
    type: 'single',
    text: 'Pediram caução ou bloqueio no cartão?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && ['locadora_grande', 'locadora_pequena'].includes(a.A2),
    options: [
      { value: 'justo', label: 'Sim, e achei o valor justo' },
      { value: 'alto', label: 'Sim, e achei alto demais' },
      { value: 'quase_desisti', label: 'Sim, e quase me fez desistir' },
      { value: 'nao_pediram', label: 'Não pediram' },
      { value: 'nao_lembro', label: 'Não lembro' },
    ],
  },
  {
    id: 'A4',
    type: 'single',
    text: 'Se hoje precisasse achar uma locadora pequena de carro, onde procuraria primeiro?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2),
    options: [
      { value: 'google', label: 'Google' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'whatsapp', label: 'WhatsApp (perguntando para conhecidos)' },
      { value: 'indicacao', label: 'Indicação pessoal' },
      { value: 'sem_ideia', label: 'Nem saberia onde começar' },
    ],
  },
  {
    id: 'A5',
    type: 'textarea',
    text: 'Já pensou em alugar carro alguma vez? Se sim, o que te impediu?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 === 'nunca',
    optional: true,
    placeholder: 'Opcional',
  },
  {
    id: 'B1',
    type: 'single',
    text: 'Quando foi a última vez que precisou de uma moto que não era sua?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
    options: [
      { value: '6m', label: 'Nos últimos 6 meses' },
      { value: '6m-2a', label: 'Há 6 meses a 2 anos' },
      { value: '2a+', label: 'Há mais de 2 anos' },
      { value: 'nunca', label: 'Nunca' },
    ],
  },
  {
    id: 'B2',
    type: 'single',
    text: 'O que você fez nessa situação?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
    options: [
      { value: 'locadora_local', label: 'Aluguei em locadora local' },
      { value: 'plataforma', label: 'Aluguei em plataforma (Mottu, etc)' },
      { value: 'emprestado', label: 'Peguei emprestado' },
      { value: 'comprei', label: 'Comprei uma moto' },
      { value: 'desisti', label: 'Desisti' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'B3_nota',
    type: 'scale',
    text: 'De 0 a 10, como foi essa experiência?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
  },
  {
    id: 'B3_texto',
    type: 'textarea',
    text: 'O que pesou nessa nota?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
    placeholder: 'Escreva com suas palavras...',
  },
  {
    id: 'B3b',
    type: 'single',
    text: 'Pediram caução ou bloqueio no cartão?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && ['locadora_local', 'plataforma'].includes(a.B2),
    options: [
      { value: 'justo', label: 'Sim, e achei o valor justo' },
      { value: 'alto', label: 'Sim, e achei alto demais' },
      { value: 'quase_desisti', label: 'Sim, e quase me fez desistir' },
      { value: 'nao_pediram', label: 'Não pediram' },
      { value: 'nao_lembro', label: 'Não lembro' },
    ],
  },
  {
    id: 'B4',
    type: 'single',
    text: 'Se fosse alugar moto, preferiria elétrica ou combustão?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
    options: [
      { value: 'eletrica', label: 'Elétrica' },
      { value: 'combustao', label: 'Combustão (gasolina)' },
      { value: 'tanto_faz', label: 'Tanto faz, depende do preço' },
      { value: 'nunca_pensei', label: 'Nunca pensei nisso' },
    ],
  },
  {
    id: 'B5',
    type: 'single',
    text: 'Se hoje precisasse achar uma locadora de moto, onde procuraria primeiro?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 === 'nunca',
    options: [
      { value: 'google', label: 'Google' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'indicacao', label: 'Indicação pessoal' },
      { value: 'sem_ideia', label: 'Nem saberia onde começar' },
    ],
  },
  {
    id: 'C1',
    type: 'single',
    text: 'Por que você não se vê alugando veículo?',
    showIf: (a) => a.P2 === 'nenhum',
    options: [
      { value: 'tem_proprio', label: 'Tenho veículo próprio que atende' },
      { value: 'usa_app', label: 'Uso Uber, 99 e transporte público para tudo' },
      { value: 'caro', label: 'Acho aluguel caro' },
      { value: 'complicado', label: 'Acho complicado' },
      { value: 'nao_confio', label: 'Não confio' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'C2',
    type: 'textarea',
    text: 'Se um dia precisar mesmo de um veículo (mudança, viagem, oficina), o que provavelmente faria?',
    showIf: (a) => a.P2 === 'nenhum',
    placeholder: 'Escreva com suas palavras...',
  },
  {
    id: 'F1',
    type: 'text',
    text: 'Em qual cidade você mora?',
    placeholder: 'Ex: Pelotas, Santa Maria, Capão do Leão',
  },
  {
    id: 'F2',
    type: 'tel',
    text: 'Deixe seu WhatsApp para concorrer ao PIX de R$ 100 💸',
    subtext: 'Sorteio no dia 23/05. Vou usar o WhatsApp apenas para avisar o vencedor.',
    optional: true,
    placeholder: '(53) 99999-9999',
  },
];
