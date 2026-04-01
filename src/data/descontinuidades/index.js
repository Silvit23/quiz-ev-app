import foto01 from '../../assets/descontinuidades/foto01.png'
import foto02 from '../../assets/descontinuidades/foto02.png'
import foto03 from '../../assets/descontinuidades/foto03.png'
import foto04 from '../../assets/descontinuidades/foto04.png'
import foto05 from '../../assets/descontinuidades/foto05.png'
import foto06 from '../../assets/descontinuidades/foto06.png'
import foto07 from '../../assets/descontinuidades/foto07.png'
import foto08 from '../../assets/descontinuidades/foto08.png'
import foto09 from '../../assets/descontinuidades/foto09.png'
import foto10 from '../../assets/descontinuidades/foto10.png'
import foto11 from '../../assets/descontinuidades/foto11.png'
import foto12 from '../../assets/descontinuidades/foto12.png'
import foto13 from '../../assets/descontinuidades/foto13.png'
import foto14 from '../../assets/descontinuidades/foto14.png'
import foto15 from '../../assets/descontinuidades/foto15.png'
import foto16 from '../../assets/descontinuidades/foto16.png'
import foto17 from '../../assets/descontinuidades/foto17.png'
import foto18 from '../../assets/descontinuidades/foto18.png'
import foto19 from '../../assets/descontinuidades/foto19.png'
import foto20 from '../../assets/descontinuidades/foto20.png'
import gabaritoFoto01 from '../../assets/gabarito-descontinuidades/gabarito_foto01.png'
import gabaritoFoto02 from '../../assets/gabarito-descontinuidades/gabarito_foto02.png'
import gabaritoFoto03 from '../../assets/gabarito-descontinuidades/gabarito_foto03.png'
import gabaritoFoto04 from '../../assets/gabarito-descontinuidades/gabarito_foto04.png'
import gabaritoFoto05 from '../../assets/gabarito-descontinuidades/gabarito_foto05.png'
import gabaritoFoto06 from '../../assets/gabarito-descontinuidades/gabarito_foto06.png'
import gabaritoFoto07 from '../../assets/gabarito-descontinuidades/gabarito_foto07.png'
import gabaritoFoto08 from '../../assets/gabarito-descontinuidades/gabarito_foto08.png'
import gabaritoFoto09 from '../../assets/gabarito-descontinuidades/gabarito_foto09.png'
import gabaritoFoto10 from '../../assets/gabarito-descontinuidades/gabarito_foto10.png'
import gabaritoFoto11 from '../../assets/gabarito-descontinuidades/gabarito_foto11.png'
import gabaritoFoto12 from '../../assets/gabarito-descontinuidades/gabarito_foto12.png'
import gabaritoFoto13 from '../../assets/gabarito-descontinuidades/gabarito_foto13.png'
import gabaritoFoto14 from '../../assets/gabarito-descontinuidades/gabarito_foto14.png'
import gabaritoFoto15 from '../../assets/gabarito-descontinuidades/gabarito_foto15.png'
import gabaritoFoto16 from '../../assets/gabarito-descontinuidades/gabarito_foto16.png'
import gabaritoFoto17 from '../../assets/gabarito-descontinuidades/gabarito_foto17.png'
import gabaritoFoto18 from '../../assets/gabarito-descontinuidades/gabarito_foto18.png'
import gabaritoFoto19 from '../../assets/gabarito-descontinuidades/gabarito_foto19.png'
import gabaritoFoto20 from '../../assets/gabarito-descontinuidades/gabarito_foto20.png'
import gabaritoRaw from './gabarito-descontinuidades.md?raw'

function parseGabarito(raw) {
  const lines = String(raw || '').split(/\r?\n/)
  const photos = []
  let current = null

  const normalizeItem = (text) =>
    String(text || '')
      .replace(/DeposiÃ§Ã£o/g, 'Deposição')
      .replace(/EscÃ³ria/g, 'Escória')
      .replace(/ReforÃ§o/g, 'Reforço')
      .replace(/SobreposiÃ§Ã£o/g, 'Sobreposição')
      .replace(/\bRespingos\b/gi, 'Respingo')

  for (const line of lines) {
    const photoMatch = line.match(/^##\s*FOTO\s*(\d+)/i)
    if (photoMatch) {
      if (current) photos.push(current)
      current = {
        photoNumber: Number(photoMatch[1]),
        items: [],
      }
      continue
    }

    const itemMatch = line.match(/^[-*]\s*\d+\s*:\s*(.+)$/)
    if (itemMatch && current) {
      current.items.push(normalizeItem(itemMatch[1].trim()))
    }
  }

  if (current) photos.push(current)
  return photos
}

const parsedPhotos = parseGabarito(gabaritoRaw)

const masterOptions = [
  'Abertura de arco',
  'Respingo',
  'Mordedura',
  'Deposição insuficiente',
  'Trinca transversal',
  'Trinca longitudinal',
  'Porosidade agrupada',
  'Porosidade alinhada',
  'Porosidade vermiforme',
  'Poro superficial',
  'Rechupe de cratera',
  'Escória',
  'Reforço excessivo',
  'Sobreposição',
]

function normalizeToMaster(item) {
  const normalized = String(item || '').trim()
  const match = masterOptions.find((option) => option.toLowerCase() === normalized.toLowerCase())
  return match || normalized
}

const photoImages = [
  foto01,
  foto02,
  foto03,
  foto04,
  foto05,
  foto06,
  foto07,
  foto08,
  foto09,
  foto10,
  foto11,
  foto12,
  foto13,
  foto14,
  foto15,
  foto16,
  foto17,
  foto18,
  foto19,
  foto20,
]

const gabaritoImages = [
  gabaritoFoto01,
  gabaritoFoto02,
  gabaritoFoto03,
  gabaritoFoto04,
  gabaritoFoto05,
  gabaritoFoto06,
  gabaritoFoto07,
  gabaritoFoto08,
  gabaritoFoto09,
  gabaritoFoto10,
  gabaritoFoto11,
  gabaritoFoto12,
  gabaritoFoto13,
  gabaritoFoto14,
  gabaritoFoto15,
  gabaritoFoto16,
  gabaritoFoto17,
  gabaritoFoto18,
  gabaritoFoto19,
  gabaritoFoto20,
]

function getImageForPhoto(photoNumber) {
  const index = Number(photoNumber) - 1
  if (Number.isNaN(index) || index < 0 || index >= photoImages.length) return null
  return photoImages[index]
}

function getGabaritoForPhoto(photoNumber) {
  const index = Number(photoNumber) - 1
  if (Number.isNaN(index) || index < 0 || index >= gabaritoImages.length) return null
  return gabaritoImages[index]
}

function buildQuestions(photos) {
  return photos.map((photo) => {
    const normalizedCorrect = photo.items.map(normalizeToMaster)
    const uniqueOptions = masterOptions.slice()
    const imageUrl = getImageForPhoto(photo.photoNumber)
    const gabaritoImageUrl = getGabaritoForPhoto(photo.photoNumber)
    const numberedAnswerKey = photo.items.map((item, index) => ({
      number: index + 1,
      label: normalizeToMaster(item),
    }))

    return {
      id: `djs-foto-${String(photo.photoNumber).padStart(2, '0')}`,
      type: 'visual',
      title: `Foto ${String(photo.photoNumber).padStart(2, '0')}`,
      statement: 'Identifique as descontinuidades presentes na imagem.',
      imageUrl,
      gabaritoImageUrl,
      options: uniqueOptions,
      correctOptions: normalizedCorrect,
      answerKey: numberedAnswerKey,
      explanation: 'Gabarito conforme material de treinamento de descontinuidades.',
    }
  })
}

const descontinuidadesQuestions = buildQuestions(parsedPhotos)

export const descontinuidadesModuleData = {
  id: 'descontinuidades-juntas-soldadas',
  title: 'Descontinuidades em Juntas Soldadas',
  shortLabel: 'Descontinuidades',
  exams: [
    {
      id: 'descontinuidades-treino-visual',
      title: 'Treino Visual',
      description: 'Treino visual com fotos do material de descontinuidades.',
      questions: descontinuidadesQuestions,
    },
  ],
}

export function getDescontinuidadesSummary() {
  return { totalPhotos: descontinuidadesQuestions.length }
}
