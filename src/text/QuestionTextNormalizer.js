function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
}

function repairBrokenWords(text) {
  return String(text || '')
    .replace(/-\n\s*/g, '') // hyphenation
    .replace(/([a-záàâãéêíóôõúç])\n([a-záàâãéêíóôõúç])/gi, '$1$2') // broken word
}

function preserveListStructure(text) {
  const lines = String(text || '').split('\n')
  const preserved = lines.map((line) => {
    const trimmed = line.trim()
    if (/^([A-E])\)/.test(trimmed)) return `\n${trimmed}`
    if (/^\d+\s*[–-]/.test(trimmed)) return `\n${trimmed}`
    return trimmed
  })
  return preserved.join(' ')
}

function normalizeRawText(raw) {
  let value = String(raw || '')
  value = normalizeWhitespace(value)
  value = repairBrokenWords(value)
  value = preserveListStructure(value)

  value = value
    .replace(/\bTeion\b/gi, 'Teórica')
    .replace(/\bp\/\b/gi, 'para')
    .replace(/\bc\/\b/gi, 'com')
    .replace(/\bc\s+onduz/gi, 'conduz')
    .replace(/\br\s+elacion/gi, 'relacion')
    .replace(/\bs\s+ubaqu/gi, 'subaqu')
    .replace(/\bcl\s+assificar/gi, 'classificar')
    .replace(/\bnã\s+o/gi, 'nao')
    .replace(/\bAsnao/gi, 'As ')
    .replace(/\basnao/gi, 'as ')
    .replace(/\bcnao/gi, 'co')
    .replace(/\bnaou\b/gi, ' ou ')
    .replace(/\bnaos\b/gi, 'nos')
    .replace(/\bverdadeiranaou\b/gi, 'verdadeira ou')
    .replace(/\bfalsanaou\b/gi, 'falsa ou')
    .replace(/\bentrenaos\b/gi, 'entre os')
    .replace(/\bdentrenaos\b/gi, 'dentre os')
    .replace(/\bapresentanaos\b/gi, 'apresenta os')
    .replace(/\bladonaonde\b/gi, 'lado onde')
    .replace(/\bformanaoriginal\b/gi, 'forma original')
    .replace(/\bnao([a-zA-Z])/g, 'nao $1')
    .replace(/([a-zA-Z])nao\b/g, '$1 nao')
    .replace(/\s{2,}/g, ' ')
    .trim()

  return value
}

function normalizeExplanation(text) {
  let cleaned = normalizeRawText(text)
  if (!cleaned) return ''

  const collapseDuplicateBlock = (value) => {
    const trimmed = value.trim()
    const half = Math.floor(trimmed.length / 2)
    if (half > 0 && trimmed.length % 2 === 0) {
      const first = trimmed.slice(0, half)
      const second = trimmed.slice(half)
      if (first === second) return first.trim()
    }
    return trimmed
  }

  cleaned = collapseDuplicateBlock(cleaned)

  const sentences = cleaned.split(/(?<=[.!?])\s+/)
  if (sentences.length > 1 && sentences.length % 2 === 0) {
    const half = sentences.length / 2
    const firstBlock = sentences.slice(0, half).join(' ')
    const secondBlock = sentences.slice(half).join(' ')
    if (firstBlock === secondBlock) {
      cleaned = firstBlock.trim()
    }
  }

  return cleaned
}

export {
  normalizeRawText,
  normalizeWhitespace,
  repairBrokenWords,
  preserveListStructure,
  normalizeExplanation,
}
