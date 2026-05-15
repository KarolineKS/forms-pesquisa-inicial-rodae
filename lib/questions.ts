export type Option = { value: string; label: string; blocking?: boolean };

export type Question = {
  id: string;
  type: 'single' | 'multi' | 'scale' | 'textarea' | 'text' | 'tel';
  text: string;
  subtext?: string;
  options?: Option[];
  showIf?: (a: Record<string, any>) => boolean;
  optional?: boolean;
  placeholder?: string;
};

export const QUESTIONS: Question[] = [
  // ============================================================================
  // FILTRO INICIAL + CONTEXTO
  // ============================================================================
  {
    id: 'P0',
    type: 'single',
    text: 'Qual é a sua idade?',
    options: [
      { value: 'menor18', label: 'Menor de 18 anos' },
      { value: '18-24', label: '18 a 24 anos' },
      { value: '25-34', label: '25 a 34 anos' },
      { value: '35-44', label: '35 a 44 anos' },
      { value: '45-54', label: '45 a 54 anos' },
      { value: '55+', label: '55 anos ou mais' },
    ],
  },
  {
    id: 'P_CIDADE',
    type: 'text',
    text: 'Em qual cidade você mora?',
    placeholder: 'Ex: Pelotas, Santa Maria, Capão do Leão',
  },
  {
    id: 'P_CNH',
    type: 'single',
    text: 'Sobre carteira de habilitação, qual sua situação hoje?',
    options: [
      { value: 'tenho', label: 'Tenho CNH' },
      { value: 'tirando', label: 'Estou no processo de tirar a CNH' },
      { value: 'quero_tirar', label: 'Quero tirar a CNH em breve' },
      { value: 'nao_tenho_sem_planos', label: 'Não tenho CNH e não pretendo tirar agora' },
    ],
  },

  // ============================================================================
  // BRANCH APRENDIZAGEM (tirando CNH ou quer tirar)
  // ============================================================================
  {
    id: 'CNH_ETAPA',
    type: 'single',
    text: 'Em que etapa do processo você está?',
    showIf: (a) => a.P_CNH === 'tirando',
    options: [
      { value: 'aulas_teoricas', label: 'Aulas teóricas / aguardando prova teórica' },
      { value: 'aulas_praticas', label: 'Fazendo aulas práticas' },
      { value: 'aguardando_prova', label: 'Aulas concluídas, aguardando prova prática' },
      { value: 'reprovado', label: 'Reprovado e refazendo aulas' },
    ],
  },
  {
    id: 'CNH_NOVA_LEI',
    type: 'single',
    text: 'Você sabia que com as mudanças da lei do Contran agora é possível fazer aulas práticas com instrutor particular, sem precisar usar só o carro do CFC?',
    showIf: (a) => ['tirando', 'quero_tirar'].includes(a.P_CNH),
    options: [
      { value: 'sim_acompanho', label: 'Sim, acompanho de perto' },
      { value: 'ouvi_falar', label: 'Ouvi falar mas não conheço os detalhes' },
      { value: 'nao_sabia', label: 'Não, não sabia disso' },
    ],
  },
  {
    id: 'CNH_RTO_AULAS',
    type: 'single',
    text: 'Se existisse a opção de ALUGAR um carro com instrutor independente para fazer suas aulas práticas, com preço menor que o CFC, você teria interesse?',
    showIf: (a) => ['tirando', 'quero_tirar'].includes(a.P_CNH),
    options: [
      { value: 'sim_certeza', label: 'Sim, com certeza usaria' },
      { value: 'sim_depende', label: 'Sim, dependendo do preço e da segurança' },
      { value: 'talvez', label: 'Talvez, preciso entender melhor' },
      { value: 'prefiro_cfc', label: 'Não, prefiro o método tradicional do CFC' },
    ],
  },
  {
    id: 'CNH_TREINO',
    type: 'single',
    text: 'E DEPOIS de tirar a CNH, você teria interesse em alugar um carro para TREINAR antes de comprar o seu?',
    showIf: (a) => ['tirando', 'quero_tirar'].includes(a.P_CNH),
    options: [
      { value: 'sim_muito', label: 'Sim, com certeza usaria' },
      { value: 'sim_depende', label: 'Sim, dependendo do preço' },
      { value: 'tenho_quem_emprestar', label: 'Não preciso, tenho alguém que empresta' },
      { value: 'vou_comprar_direto', label: 'Vou direto para a compra' },
      { value: 'nao_dirigirei', label: 'Não pretendo dirigir muito após tirar' },
    ],
  },
  {
    id: 'CNH_DOR',
    type: 'textarea',
    text: 'Qual a maior dificuldade que você tem (ou imagina ter) no processo de tirar a CNH?',
    showIf: (a) => ['tirando', 'quero_tirar'].includes(a.P_CNH),
    placeholder: 'Preço, tempo, medo, falta de carro para praticar... conta com suas palavras.',
  },
  {
    id: 'CNH_RTO',
    type: 'single',
    text: 'Depois de tirar a CNH, você teria interesse em ALUGAR um veículo com OPÇÃO DE COMPRA no final?',
    subtext: 'Modelo onde você paga aluguel mensal por um período (ex: 24 meses) e ao final pode ficar com o veículo. Ajuda quem não tem dinheiro para entrada à vista.',
    showIf: (a) => ['tirando', 'quero_tirar'].includes(a.P_CNH),
    options: [
      { value: 'sim_carro_combustao', label: 'Sim, com carro a combustão' },
      { value: 'sim_carro_eletrico', label: 'Sim, com carro elétrico' },
      { value: 'sim_moto_combustao', label: 'Sim, com moto a combustão' },
      { value: 'sim_moto_eletrica', label: 'Sim, com moto elétrica' },
      { value: 'sim_tanto_faz', label: 'Sim, tanto faz o tipo' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'nao', label: 'Não tenho interesse' },
    ],
  },

  // === Menor de 18 sem CNH ===
  {
    id: 'MENOR_CNH',
    type: 'single',
    text: 'Você pretende tirar CNH quando completar 18 anos?',
    showIf: (a) => a.P0 === 'menor18' && a.P_CNH === 'nao_tenho_sem_planos',
    options: [
      { value: 'sim_em_breve', label: 'Sim, assim que completar 18' },
      { value: 'sim_um_dia', label: 'Sim, mas sem pressa' },
      { value: 'nao', label: 'Não pretendo tirar' },
      { value: 'nao_pensei', label: 'Ainda não pensei nisso' },
    ],
  },

  // === Adulto sem CNH e sem planos ===
  {
    id: 'SEM_CNH_MOTIVO',
    type: 'single',
    text: 'O que mais pesa na sua decisão de não tirar CNH?',
    showIf: (a) => a.P0 !== 'menor18' && a.P_CNH === 'nao_tenho_sem_planos',
    options: [
      { value: 'caro', label: 'Tirar CNH é caro' },
      { value: 'nao_preciso', label: 'Não preciso, uso transporte público/apps' },
      { value: 'medo', label: 'Tenho medo de dirigir' },
      { value: 'sem_tempo', label: 'Não tenho tempo pro processo' },
      { value: 'cidade', label: 'Minha cidade não exige carro pro dia a dia' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'SEM_CNH_FUTURO',
    type: 'single',
    text: 'Se as condições mudassem (preço, tempo, processo mais fácil), você consideraria tirar?',
    showIf: (a) => a.P0 !== 'menor18' && a.P_CNH === 'nao_tenho_sem_planos',
    options: [
      { value: 'sim_provavel', label: 'Sim, provavelmente tiraria' },
      { value: 'talvez', label: 'Talvez, dependendo da situação' },
      { value: 'dificil', label: 'Difícil mudar de ideia' },
      { value: 'jamais', label: 'Não, jamais tirarei' },
    ],
  },

  // ============================================================================
  // P1 - rotina (só pra quem tem CNH)
  // ============================================================================
  {
    id: 'P1',
    type: 'single',
    text: 'Qual destas situações mais combina com sua rotina hoje?',
    showIf: (a) => !['tirando', 'quero_tirar', 'nao_tenho_sem_planos'].includes(a.P_CNH),
    options: [
      { value: 'app_transporte', label: 'Trabalho com aplicativo de transporte (Uber, 99, InDriver)' },
      { value: 'delivery', label: 'Trabalho com delivery (iFood, Rappi, Loggi)' },
      { value: 'trabalho_profissional', label: 'Uso veículo para trabalho ou profissão (representante, técnico, autônomo, etc)' },
      { value: 'viajante', label: 'Viajo de vez em quando, a passeio ou a trabalho' },
      { value: 'nao_dirige', label: 'Não dirijo no dia a dia' },
      { value: 'outro', label: 'Outro' },
    ],
  },

  // ============================================================================
  // BRANCH PROFISSIONAL APP
  // ============================================================================
  {
    id: 'PR_APPS',
    type: 'multi',
    text: 'Em quais aplicativos você trabalha hoje?',
    subtext: 'Pode marcar mais de um',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'uber', label: 'Uber' },
      { value: '99', label: '99' },
      { value: 'indriver', label: 'InDriver' },
      { value: 'ifood', label: 'iFood' },
      { value: 'rappi', label: 'Rappi' },
      { value: 'loggi', label: 'Loggi' },
      { value: 'outro_app', label: 'Outro aplicativo' },
    ],
  },
  {
    id: 'PR_TIPO',
    type: 'single',
    text: 'Você trabalha principalmente com:',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'carro', label: 'Carro' },
      { value: 'moto', label: 'Moto' },
      { value: 'bike', label: 'Bicicleta (comum ou elétrica)' },
      { value: 'patinete', label: 'Patinete' },
      { value: 'misto', label: 'Mais de um (varia conforme o dia/serviço)' },
    ],
  },
  {
    id: 'PR0',
    type: 'single',
    text: 'Há quanto tempo você trabalha com aplicativo?',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'menos_6m', label: 'Menos de 6 meses' },
      { value: '6m-2a', label: '6 meses a 2 anos' },
      { value: '2-5a', label: '2 a 5 anos' },
      { value: '5a+', label: 'Mais de 5 anos' },
    ],
  },
  {
    id: 'PR1',
    type: 'single',
    text: 'O veículo que você usa para trabalhar é:',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && !['bike', 'patinete'].includes(a.PR_TIPO),
    options: [
      { value: 'proprio_quitado', label: 'Próprio e quitado' },
      { value: 'proprio_financiado', label: 'Próprio mas ainda financiado' },
      { value: 'alugado_pelo_app', label: 'Alugado pelo próprio app (Uber Aluguel, 99Aluga, iFood Aluguel)' },
      { value: 'alugado_plataforma', label: 'Alugado de plataforma especializada (Kovi, Mottu, Localiza Meoo)' },
      { value: 'alugado_locadora', label: 'Alugado de locadora tradicional (Localiza, Movida, Unidas, locadora local)' },
      { value: 'alugado_particular', label: 'Alugado de pessoa particular (Facebook, indicação)' },
      { value: 'emprestado', label: 'Emprestado de família ou amigo' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PR_BIKE',
    type: 'single',
    text: 'A bicicleta ou patinete que você usa é:',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && ['bike', 'patinete'].includes(a.PR_TIPO),
    options: [
      { value: 'proprio_comum', label: 'Própria, comum (sem motor elétrico)' },
      { value: 'proprio_eletrica', label: 'Própria, elétrica' },
      { value: 'alugada_eletrica', label: 'Alugada, elétrica (iFood Pedal, Tembici, etc)' },
      { value: 'alugada_comum', label: 'Alugada, comum' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PR_GASTO',
    type: 'single',
    text: 'Em média, quanto você gasta POR MÊS com o veículo do trabalho?',
    subtext: 'Considere combustível, manutenção, aluguel ou parcela',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && !['bike', 'patinete'].includes(a.PR_TIPO),
    options: [
      { value: 'ate800', label: 'Até R$ 800' },
      { value: '800-1500', label: 'R$ 800 a R$ 1.500' },
      { value: '1500-2500', label: 'R$ 1.500 a R$ 2.500' },
      { value: '2500-4000', label: 'R$ 2.500 a R$ 4.000' },
      { value: '4000+', label: 'Mais de R$ 4.000' },
      { value: 'nao_sei', label: 'Não sei dizer' },
    ],
  },

  // === Sub-branch: quem ALUGA pra trabalhar ===
  {
    id: 'PR2_freq',
    type: 'single',
    text: 'Você aluga em que frequência?',
    showIf: (a) => ['alugado_pelo_app', 'alugado_plataforma', 'alugado_locadora', 'alugado_particular'].includes(a.PR1),
    options: [
      { value: 'diaria', label: 'Diária' },
      { value: 'semanal', label: 'Semanal' },
      { value: 'mensal', label: 'Mensal' },
      { value: 'longa', label: 'Contrato de longa duração (3+ meses)' },
    ],
  },
  {
    id: 'PR2_nota',
    type: 'scale',
    text: 'De 0 a 10, como é sua experiência alugando esse veículo para trabalhar?',
    showIf: (a) => ['alugado_pelo_app', 'alugado_plataforma', 'alugado_locadora', 'alugado_particular'].includes(a.PR1),
  },
  {
    id: 'PR2_dor',
    type: 'textarea',
    text: 'O que mais te incomoda hoje no processo de alugar veículo para trabalhar?',
    showIf: (a) => ['alugado_pelo_app', 'alugado_plataforma', 'alugado_locadora', 'alugado_particular'].includes(a.PR1),
    placeholder: 'Conta com suas palavras, fica à vontade...',
  },
  {
    id: 'PR2_trocou',
    type: 'single',
    text: 'Você já trocou de fornecedor (locadora ou plataforma) nos últimos 12 meses?',
    showIf: (a) => ['alugado_pelo_app', 'alugado_plataforma', 'alugado_locadora', 'alugado_particular'].includes(a.PR1),
    options: [
      { value: 'sim_1', label: 'Sim, 1 vez' },
      { value: 'sim_2plus', label: 'Sim, 2 ou mais vezes' },
      { value: 'pensei', label: 'Não troquei, mas pensei em trocar' },
      { value: 'nao', label: 'Não, estou satisfeito' },
    ],
  },

  // === Sub-branch: quem tem PRÓPRIO ===
  {
    id: 'PR3_motivo',
    type: 'single',
    text: 'Por que você usa veículo próprio em vez de alugar?',
    showIf: (a) => ['proprio_quitado', 'proprio_financiado'].includes(a.PR1) && ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'sai_barato', label: 'Sai mais barato no longo prazo' },
      { value: 'liberdade', label: 'Tenho mais liberdade (usar fora do trabalho, etc)' },
      { value: 'nao_confio', label: 'Não confio nas locadoras/plataformas' },
      { value: 'nao_acho', label: 'Não encontrei opção boa na minha cidade' },
      { value: 'sem_dinheiro_inicial', label: 'Não tenho dinheiro pra caução/entrada' },
      { value: 'nunca_pensei', label: 'Nunca pensei em alugar' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PR3_consideraria',
    type: 'single',
    text: 'Se aparecesse uma opção boa de aluguel na sua cidade, com preço justo e processo simples, você consideraria?',
    showIf: (a) => ['proprio_quitado', 'proprio_financiado'].includes(a.PR1) && ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'sim_claro', label: 'Sim, com certeza testaria' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'dificilmente', label: 'Dificilmente, prefiro meu próprio' },
      { value: 'nunca', label: 'Não, jamais alugaria' },
    ],
  },

  // === Churn ===
  {
    id: 'PR_CHURN',
    type: 'single',
    text: 'Você já pensou em parar de trabalhar com aplicativo por causa do custo do veículo?',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'sim_seguido', label: 'Sim, penso nisso com frequência' },
      { value: 'sim_as_vezes', label: 'Sim, às vezes' },
      { value: 'pensei_uma_vez', label: 'Pensei uma vez ou outra' },
      { value: 'nunca', label: 'Nunca pensei nisso' },
    ],
  },

  // === Bloco elétrico — MOTO ===
  {
    id: 'PR_ELETRICO_MOTO',
    type: 'single',
    text: 'Você já pensou em usar uma MOTO ELÉTRICA para trabalhar?',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && a.PR_TIPO === 'moto',
    options: [
      { value: 'ja_uso', label: 'Já uso moto elétrica' },
      { value: 'sim_consideraria', label: 'Sim, consideraria seriamente' },
      { value: 'curioso', label: 'Tenho curiosidade, mas tenho dúvidas' },
      { value: 'nao_funciona', label: 'Não, não funciona pra minha rotina' },
      { value: 'nunca_pensei', label: 'Nunca pensei nisso' },
    ],
  },
  {
    id: 'PR_ELETRICO_MOTO_RECEIO',
    type: 'multi',
    text: 'O que mais te preocuparia ao trocar para uma moto elétrica?',
    subtext: 'Pode marcar mais de um',
    showIf: (a) =>
      ['app_transporte', 'delivery'].includes(a.P1) &&
      a.PR_TIPO === 'moto' &&
      ['sim_consideraria', 'curioso', 'nao_funciona', 'nunca_pensei'].includes(a.PR_ELETRICO_MOTO),
    options: [
      { value: 'onde_carregar', label: 'Onde recarregar (não tenho garagem, não sei onde tem ponto)' },
      { value: 'tempo_carga', label: 'Tempo de recarga atrapalhar o trabalho' },
      { value: 'autonomia', label: 'Não saber se a autonomia aguenta um dia inteiro' },
      { value: 'preco', label: 'Preço da moto ou do aluguel ser mais alto' },
      { value: 'manutencao', label: 'Não confio na manutenção (mecânicos não sabem mexer)' },
      { value: 'durabilidade', label: 'Durabilidade da bateria a longo prazo' },
      { value: 'seguro', label: 'Seguro/garantia em caso de problema' },
      { value: 'desempenho', label: 'Desempenho (potência, velocidade)' },
      { value: 'nada', label: 'Nada me preocupa, eu trocaria fácil' },
    ],
  },

  // === Bloco elétrico — CARRO ===
  {
    id: 'PR_ELETRICO_CARRO',
    type: 'single',
    text: 'Você já pensou em usar um CARRO ELÉTRICO para trabalhar?',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && a.PR_TIPO === 'carro',
    options: [
      { value: 'ja_uso', label: 'Já uso carro elétrico' },
      { value: 'sim_consideraria', label: 'Sim, consideraria seriamente' },
      { value: 'curioso', label: 'Tenho curiosidade, mas tenho dúvidas' },
      { value: 'nao_funciona', label: 'Não, não funciona pra minha rotina' },
      { value: 'nunca_pensei', label: 'Nunca pensei nisso' },
    ],
  },
  {
    id: 'PR_ELETRICO_CARRO_RECEIO',
    type: 'multi',
    text: 'O que mais te preocuparia ao trocar para um carro elétrico?',
    subtext: 'Pode marcar mais de um',
    showIf: (a) =>
      ['app_transporte', 'delivery'].includes(a.P1) &&
      a.PR_TIPO === 'carro' &&
      ['sim_consideraria', 'curioso', 'nao_funciona', 'nunca_pensei'].includes(a.PR_ELETRICO_CARRO),
    options: [
      { value: 'onde_carregar', label: 'Onde recarregar (não tenho garagem, postos longe)' },
      { value: 'tempo_carga', label: 'Tempo de recarga atrapalhar as corridas' },
      { value: 'autonomia', label: 'Autonomia não aguentar um dia inteiro' },
      { value: 'preco', label: 'Preço do carro ou do aluguel ser mais alto' },
      { value: 'manutencao', label: 'Manutenção (mecânicos, peças caras)' },
      { value: 'durabilidade', label: 'Durabilidade da bateria a longo prazo' },
      { value: 'seguro', label: 'Seguro mais caro ou complicado' },
      { value: 'revenda', label: 'Dificuldade de revender depois' },
      { value: 'nada', label: 'Nada me preocupa, eu trocaria fácil' },
    ],
  },

  // ============================================================================
  // BRANCH PROFISSIONAL NÃO-APP
  // ============================================================================
  {
    id: 'PROF_PROFISSAO',
    type: 'single',
    text: 'Em qual destas áreas você atua?',
    showIf: (a) => a.P1 === 'trabalho_profissional',
    options: [
      { value: 'vendas', label: 'Vendas externas / representante comercial' },
      { value: 'tecnico', label: 'Serviços técnicos (eletricista, encanador, técnico de campo)' },
      { value: 'saude', label: 'Saúde (atendimento domiciliar, visitas)' },
      { value: 'transporte_carga', label: 'Transporte de carga, frete autônomo' },
      { value: 'motoboy', label: 'Motoboy independente (não-app)' },
      { value: 'escolar', label: 'Motorista escolar' },
      { value: 'autonomo_outros', label: 'Outro autônomo / MEI que depende do veículo' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'PROF_VEICULO',
    type: 'single',
    text: 'Que tipo de veículo você usa principalmente para trabalho?',
    showIf: (a) => a.P1 === 'trabalho_profissional',
    options: [
      { value: 'carro', label: 'Carro' },
      { value: 'moto', label: 'Moto' },
      { value: 'utilitario', label: 'Utilitário ou van (Kangoo, Doblo, Fiorino)' },
      { value: 'pickup', label: 'Caminhonete ou pickup' },
      { value: 'caminhao', label: 'Caminhão pequeno' },
    ],
  },
  {
    id: 'PROF_FONTE',
    type: 'single',
    text: 'Esse veículo é:',
    showIf: (a) => a.P1 === 'trabalho_profissional',
    options: [
      { value: 'proprio', label: 'Próprio' },
      { value: 'empresa', label: 'Da empresa onde trabalho' },
      { value: 'alugado', label: 'Alugado' },
      { value: 'misto', label: 'Depende do dia (uso o meu e às vezes alugo)' },
    ],
  },

  // === Sub-branch: profissional que ALUGA ===
  {
    id: 'PROF_ALUGA_ONDE',
    type: 'single',
    text: 'Onde você costuma alugar o veículo de trabalho?',
    showIf: (a) => a.P1 === 'trabalho_profissional' && ['alugado', 'misto'].includes(a.PROF_FONTE),
    options: [
      { value: 'locadora_grande', label: 'Locadora grande (Localiza, Movida, Unidas)' },
      { value: 'locadora_pequena', label: 'Locadora pequena local' },
      { value: 'particular', label: 'Direto com particular (Facebook, indicação)' },
      { value: 'plataforma', label: 'Plataforma online (Kovi, Mottu, similar)' },
      { value: 'varia', label: 'Varia, dependendo da situação' },
    ],
  },
  {
    id: 'PROF_ALUGA_NOTA',
    type: 'scale',
    text: 'De 0 a 10, como é sua experiência alugando para trabalhar?',
    showIf: (a) => a.P1 === 'trabalho_profissional' && ['alugado', 'misto'].includes(a.PROF_FONTE),
  },
  {
    id: 'PROF_ALUGA_DOR',
    type: 'textarea',
    text: 'O que mais te incomoda no processo de alugar veículo pra trabalhar?',
    showIf: (a) => a.P1 === 'trabalho_profissional' && ['alugado', 'misto'].includes(a.PROF_FONTE),
    placeholder: 'Conta com suas palavras...',
  },

  // === Sub-branch: profissional com PRÓPRIO/EMPRESA ===
  {
    id: 'PROF_FALTA',
    type: 'single',
    text: 'Quando seu veículo quebra ou precisa de manutenção, o que você costuma fazer?',
    showIf: (a) => a.P1 === 'trabalho_profissional' && ['proprio', 'empresa'].includes(a.PROF_FONTE),
    options: [
      { value: 'aluga_locadora', label: 'Alugo em uma locadora' },
      { value: 'empresta', label: 'Pego emprestado com alguém' },
      { value: 'uber', label: 'Uso Uber/99 enquanto resolve' },
      { value: 'remarca', label: 'Remarco compromissos ou trabalho de casa' },
      { value: 'nunca_aconteceu', label: 'Nunca passei por isso' },
      { value: 'outro', label: 'Outro' },
    ],
  },

  // === Pergunta geral pra todos os profissionais ===
  {
    id: 'PROF_DOR',
    type: 'textarea',
    text: 'Qual a maior dificuldade que você enfrenta hoje com o veículo do trabalho?',
    showIf: (a) => a.P1 === 'trabalho_profissional',
    placeholder: 'Conta com suas palavras...',
  },
  {
    id: 'PROF_RTO',
    type: 'single',
    text: 'Você teria interesse em ALUGAR um veículo com OPÇÃO DE COMPRA no final?',
    subtext: 'Modelo onde você paga aluguel mensal por um período (ex: 24 meses) e ao final pode ficar com o veículo.',
    showIf: (a) => a.P1 === 'trabalho_profissional',
    options: [
      { value: 'sim_combustao', label: 'Sim, com veículo a combustão (gasolina/etanol)' },
      { value: 'sim_eletrico', label: 'Sim, com veículo elétrico' },
      { value: 'sim_tanto_faz', label: 'Sim, tanto faz se elétrico ou combustão' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'nao', label: 'Não tenho interesse' },
      { value: 'nunca_ouvi', label: 'Nunca ouvi falar desse modelo' },
    ],
  },

  // ============================================================================
  // RENT-TO-OWN — pra profissionais de app
  // ============================================================================
  {
    id: 'RTO_INTERESSE',
    type: 'single',
    text: 'Você teria interesse em ALUGAR um veículo com OPÇÃO DE COMPRA no final?',
    subtext: 'Modelo onde você paga aluguel mensal por um período (ex: 24 meses) e ao final pode ficar com o veículo.',
    showIf: (a) => ['app_transporte', 'delivery'].includes(a.P1) && !['bike', 'patinete'].includes(a.PR_TIPO),
    options: [
      { value: 'sim_muito', label: 'Sim, tenho muito interesse' },
      { value: 'sim_depende', label: 'Sim, dependendo das condições (preço, prazo, etc)' },
      { value: 'curioso', label: 'Tenho curiosidade, mas tenho dúvidas' },
      { value: 'nao', label: 'Não, prefiro só alugar ou só comprar' },
      { value: 'nunca_ouvi', label: 'Nunca ouvi falar desse modelo' },
    ],
  },
  {
    id: 'RTO_TIPO',
    type: 'multi',
    text: 'Se fosse alugar com opção de compra, qual modalidade te interessaria?',
    subtext: 'Pode marcar mais de uma',
    showIf: (a) =>
      ['app_transporte', 'delivery'].includes(a.P1) &&
      !['bike', 'patinete'].includes(a.PR_TIPO) &&
      ['sim_muito', 'sim_depende', 'curioso'].includes(a.RTO_INTERESSE),
    options: [
      { value: 'carro_combustao', label: 'Carro a combustão (gasolina/etanol)' },
      { value: 'carro_eletrico', label: 'Carro elétrico' },
      { value: 'moto_combustao', label: 'Moto a combustão (gasolina)' },
      { value: 'moto_eletrica', label: 'Moto elétrica' },
      { value: 'tanto_faz', label: 'Tanto faz, depende do que for melhor pra rotina' },
    ],
  },

  // ============================================================================
  // P2 (só pra quem NÃO é profissional de app)
  // ============================================================================
  {
    id: 'P2',
    type: 'single',
    text: 'Em situações em que você poderia alugar um veículo, o que faz mais sentido?',
    showIf: (a) => !['app_transporte', 'delivery'].includes(a.P1),
    options: [
      { value: 'carro', label: 'Carro' },
      { value: 'moto', label: 'Moto' },
      { value: 'ambos', label: 'Pode ser qualquer um' },
      { value: 'nenhum', label: 'Não me vejo alugando' },
    ],
  },

  // ============================================================================
  // FLUXO A - CARRO
  // ============================================================================
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
    id: 'A_motivo',
    type: 'single',
    text: 'Para que você precisou do carro?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca',
    options: [
      { value: 'viagem_lazer', label: 'Viagem a passeio' },
      { value: 'viagem_trabalho', label: 'Viagem a trabalho' },
      { value: 'mudanca', label: 'Mudança ou transporte de coisas' },
      { value: 'carro_oficina', label: 'Carro próprio na oficina' },
      { value: 'evento', label: 'Evento (casamento, festa)' },
      { value: 'compromisso', label: 'Compromisso profissional pontual' },
      { value: 'outro', label: 'Outro' },
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
    id: 'A_gasto',
    type: 'single',
    text: 'Quanto você gastou no total nessa situação?',
    showIf: (a) =>
      ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca' && !['desisti', 'emprestado'].includes(a.A2),
    options: [
      { value: 'ate200', label: 'Até R$ 200' },
      { value: '200-500', label: 'R$ 200 a R$ 500' },
      { value: '500-1000', label: 'R$ 500 a R$ 1.000' },
      { value: '1000-2000', label: 'R$ 1.000 a R$ 2.000' },
      { value: '2000+', label: 'Mais de R$ 2.000' },
      { value: 'nao_lembro', label: 'Não lembro' },
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
    text: 'Por que essa nota?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2) && a.A1 !== 'nunca',
    placeholder: 'Conta com suas palavras...',
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
    id: 'A_desistencia',
    type: 'single',
    text: 'Nos últimos 12 meses, quantas vezes você pesquisou para alugar carro e desistiu sem fechar?',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2),
    options: [
      { value: 'nenhuma', label: 'Nenhuma' },
      { value: '1', label: '1 vez' },
      { value: '2-3', label: '2 a 3 vezes' },
      { value: '4+', label: '4 ou mais' },
    ],
  },
  {
    id: 'A_RTO',
    type: 'single',
    text: 'Você teria interesse em ALUGAR um carro com OPÇÃO DE COMPRA no final?',
    subtext: 'Modelo onde você paga aluguel mensal por um período (ex: 24 meses) e ao final pode ficar com o carro.',
    showIf: (a) => ['carro', 'ambos'].includes(a.P2),
    options: [
      { value: 'sim_combustao', label: 'Sim, com carro a combustão (gasolina/etanol)' },
      { value: 'sim_eletrico', label: 'Sim, com carro elétrico' },
      { value: 'sim_tanto_faz', label: 'Sim, tanto faz se elétrico ou combustão' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'nao', label: 'Não tenho interesse' },
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

  // ============================================================================
  // FLUXO B - MOTO
  // ============================================================================
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
    id: 'B_motivo',
    type: 'single',
    text: 'Para que você precisou da moto?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
    options: [
      { value: 'locomocao', label: 'Locomoção do dia a dia' },
      { value: 'trabalho_temp', label: 'Trabalho temporário (delivery, etc)' },
      { value: 'viagem', label: 'Viagem a passeio' },
      { value: 'moto_oficina', label: 'Moto própria na oficina' },
      { value: 'experimentar', label: 'Experimentar antes de comprar' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'B2',
    type: 'single',
    text: 'O que você fez nessa situação?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
    options: [
      { value: 'locadora_local', label: 'Aluguei em locadora local' },
      { value: 'plataforma', label: 'Aluguei em plataforma especializada (Mottu, Kovi)' },
      { value: 'particular', label: 'Aluguei com particular (Facebook, indicação)' },
      { value: 'emprestado', label: 'Peguei emprestado' },
      { value: 'comprei', label: 'Acabei comprando uma moto' },
      { value: 'desisti', label: 'Desisti' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'B_gasto',
    type: 'single',
    text: 'Quanto você gastou no total nessa situação?',
    showIf: (a) =>
      ['moto', 'ambos'].includes(a.P2) &&
      a.B1 !== 'nunca' &&
      !['desisti', 'emprestado', 'comprei'].includes(a.B2),
    options: [
      { value: 'ate100', label: 'Até R$ 100' },
      { value: '100-300', label: 'R$ 100 a R$ 300' },
      { value: '300-600', label: 'R$ 300 a R$ 600' },
      { value: '600-1200', label: 'R$ 600 a R$ 1.200' },
      { value: '1200+', label: 'Mais de R$ 1.200' },
      { value: 'nao_lembro', label: 'Não lembro' },
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
    text: 'Por que essa nota?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B1 !== 'nunca',
    placeholder: 'Conta com suas palavras...',
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
    text: 'Se fosse alugar moto, você preferiria elétrica ou combustão?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
    options: [
      { value: 'eletrica', label: 'Elétrica' },
      { value: 'combustao', label: 'Combustão (gasolina)' },
      { value: 'tanto_faz', label: 'Tanto faz, depende do preço' },
      { value: 'nunca_pensei', label: 'Nunca pensei nisso' },
    ],
  },
  {
    id: 'B4_RECEIO',
    type: 'multi',
    text: 'O que mais te preocuparia ao alugar uma moto ELÉTRICA?',
    subtext: 'Pode marcar mais de um',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2) && a.B4 !== 'combustao',
    options: [
      { value: 'onde_carregar', label: 'Onde recarregar (não saber pontos de recarga)' },
      { value: 'tempo_carga', label: 'Tempo de recarga' },
      { value: 'autonomia', label: 'Autonomia (quanto roda com uma carga)' },
      { value: 'preco', label: 'Preço do aluguel ser mais alto' },
      { value: 'manutencao', label: 'Manutenção/assistência se der problema' },
      { value: 'desempenho', label: 'Desempenho (potência, velocidade)' },
      { value: 'nada', label: 'Nada me preocupa' },
    ],
  },
  {
    id: 'B5',
    type: 'single',
    text: 'Se hoje precisasse achar uma locadora de moto, onde procuraria primeiro?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
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
    id: 'B_desistencia',
    type: 'single',
    text: 'Nos últimos 12 meses, quantas vezes você pesquisou para alugar moto e desistiu sem fechar?',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
    options: [
      { value: 'nenhuma', label: 'Nenhuma' },
      { value: '1', label: '1 vez' },
      { value: '2-3', label: '2 a 3 vezes' },
      { value: '4+', label: '4 ou mais' },
    ],
  },
  {
    id: 'B_RTO',
    type: 'single',
    text: 'Você teria interesse em ALUGAR uma moto com OPÇÃO DE COMPRA no final?',
    subtext: 'Modelo onde você paga aluguel mensal por um período e ao final pode ficar com a moto.',
    showIf: (a) => ['moto', 'ambos'].includes(a.P2),
    options: [
      { value: 'sim_combustao', label: 'Sim, com moto a combustão (gasolina)' },
      { value: 'sim_eletrica', label: 'Sim, com moto elétrica' },
      { value: 'sim_tanto_faz', label: 'Sim, tanto faz se elétrica ou combustão' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'nao', label: 'Não tenho interesse' },
    ],
  },

  // ============================================================================
  // FLUXO C - NÃO INTERESSADO
  // ============================================================================
  {
    id: 'C1',
    type: 'single',
    text: 'O que mais pesa na sua decisão de não alugar?',
    showIf: (a) => a.P2 === 'nenhum',
    options: [
      { value: 'tem_proprio', label: 'Tenho veículo próprio que atende' },
      { value: 'usa_app', label: 'Uso Uber, 99 e transporte público para tudo' },
      { value: 'caro', label: 'Acho aluguel caro demais' },
      { value: 'complicado', label: 'Acho o processo complicado/burocrático' },
      { value: 'nao_confio', label: 'Não confio nas locadoras' },
      { value: 'experiencia_ruim', label: 'Já tive experiência ruim e não quero repetir' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    id: 'C_RTO',
    type: 'single',
    text: 'E se existisse a opção de alugar um veículo com OPÇÃO DE COMPRA no final, isso mudaria algo pra você?',
    subtext: 'Modelo onde você paga aluguel mensal e ao final fica com o veículo.',
    showIf: (a) => a.P2 === 'nenhum',
    options: [
      { value: 'sim_mudaria', label: 'Sim, isso mudaria minha visão' },
      { value: 'talvez', label: 'Talvez, dependendo das condições' },
      { value: 'nao', label: 'Não, continuo sem interesse' },
      { value: 'nunca_ouvi', label: 'Nunca ouvi falar desse modelo, preciso entender melhor' },
    ],
  },

  // ============================================================================
  // FECHAMENTO
  // ============================================================================
  {
    id: 'F2',
    type: 'tel',
    text: 'Deixe seu WhatsApp para concorrer ao PIX de R$ 200',
    subtext: 'Sorteio no dia 23/05. O WhatsApp será usado apenas para avisar o vencedor.',
    optional: true,
    placeholder: '(53) 99999-9999',
  },
  {
    id: 'F_ABERTO',
    type: 'textarea',
    text: 'Tem mais alguma coisa que você queira contar sobre aluguel de veículos?',
    subtext: 'Pode ser uma história, uma reclamação, uma ideia, o que vier. Fica à vontade.',
    optional: true,
    placeholder: 'Opcional, mas se algo vier na cabeça, escreve aqui...',
  },
];
