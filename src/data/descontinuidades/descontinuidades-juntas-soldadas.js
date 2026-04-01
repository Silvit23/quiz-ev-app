const descontinuidadesMockExam = {
  id: 'descontinuidades-simulado-01',
  title: 'Simulado Local 01',
  description: 'Base mockada para estrutura inicial do app.',
  questions: [
    {
      id: 'djs-001',
      statement: 'Questão mockada (não oficial): em juntas soldadas, a EV ajuda a identificar?',
      alternatives: [
        { id: 'a', text: 'Somente composição química do metal base.' },
        { id: 'b', text: 'Indícios visuais de descontinuidades superficiais.' },
        { id: 'c', text: 'Exclusivamente propriedades mecânicas internas.' },
        { id: 'd', text: 'Apenas temperatura de operação da estrutura.' },
      ],
      correctAlternativeId: 'b',
      explanation: 'No mock, a alternativa B foi definida como correta apenas para validação de fluxo.',
    },
    {
      id: 'djs-002',
      statement: 'Questão mockada (não oficial): qual prática melhora a revisão posterior?',
      alternatives: [
        { id: 'a', text: 'Registrar imagens sem referência de local.' },
        { id: 'b', text: 'Evitar padronização para flexibilizar análise.' },
        { id: 'c', text: 'Usar identificação consistente por ponto inspecionado.' },
        { id: 'd', text: 'Descartar imagens após inspeção inicial.' },
      ],
      correctAlternativeId: 'c',
      explanation: 'No mock, a alternativa C foi definida como correta apenas para validação de fluxo.',
    },
  ],
}

export const descontinuidadesModuleData = {
  id: 'descontinuidades-juntas-soldadas',
  title: 'Descontinuidades em Juntas Soldadas',
  shortLabel: 'Descontinuidades',
  exams: [descontinuidadesMockExam],
}

