export const SCHOOLS = [
  {
    id: 'udg',
    name: 'Preparatoria UDG',
    exam: 'PIENSE II',
    icon: '🎓',
    gradient: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    desc: 'Universidad de Guadalajara',
    places: '~12,000 lugares',
  },
  {
    id: 'cecytej',
    name: 'CECyTEJ',
    exam: 'Examen CECyTEJ',
    icon: '🔬',
    gradient: 'from-green-500 to-green-700',
    badge: 'bg-green-100 text-green-800',
    desc: 'Colegio de Estudios Científicos de Jalisco',
    places: '~8,000 lugares',
  },
  {
    id: 'cobaej',
    name: 'COBAEJ',
    exam: 'PIENSE II',
    icon: '📚',
    gradient: 'from-orange-500 to-orange-700',
    badge: 'bg-orange-100 text-orange-800',
    desc: 'Colegio de Bachilleres del Estado de Jalisco',
    places: '~6,000 lugares',
  },

  {
    id: 'ceti',
    name: 'CETI Colomos',
    exam: 'EXANI-I',
    icon: '⚙️',
    gradient: 'from-purple-500 to-purple-700',
    badge: 'bg-purple-100 text-purple-800',
    desc: 'Centro de Enseñanza Técnica Industrial',
    places: '~2,500 lugares',
  },
  {
    id: 'tecmilenio',
    name: 'TecMilenio',
    exam: 'EXANI-I',
    icon: '🚀',
    gradient: 'from-red-500 to-red-700',
    badge: 'bg-red-100 text-red-800',
    desc: 'Universidad TecMilenio',
    places: '~4,000 lugares',
  },
]

export function getSchool(id) {
  return SCHOOLS.find((s) => s.id === id) || null
}
