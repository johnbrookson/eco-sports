import type { Athlete } from "@/types/athlete";

// Mock fixtures para desenvolvimento do perfil público e editor interno.
// O array é mutado in-place pelo saveProfile Server Action durante o stub —
// sobrevive dentro do processo do dev server, reset ao restart.
// Quando o backend existir, trocar por fetch/persistência real mantendo o shape.

export const mockAthletes: Athlete[] = [
  {
    id: "a7b4c5d8-1e2f-4a3b-9c8d-0e1f2a3b4c5d",
    tenantId: "tenant-demo-individual",
    slug: "joao-silva-2008",
    profile: {
      firstName: "João",
      lastName: "Silva",
      preferredName: "Joãozinho",
      birthDate: "2008-05-14",
      gender: "male",
      country: "BR",
      state: "SP",
      city: "São Paulo",
      nationality: "Brasileiro",
      photoUrl:
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1600&q=80&auto=format&fit=crop",
      bio: "Armador com visão de jogo acima da média para a idade, leitura rápida de pick-and-roll e mão boa em transição. Começou no basquete aos sete anos em projeto social da Zona Leste de São Paulo, passou pela peneira do clube aos onze e hoje lidera a categoria sub-17 nas competições estaduais. Fora da quadra, é aluno de escola pública integral com meta declarada de cursar Engenharia pela USP.",
    },
    contact: {
      email: "joao.silva@exemplo.com",
      instagram: "@joaosilva.bball",
    },
    guardians: [
      {
        name: "Ana Silva",
        relationship: "mother",
        phone: "+55 11 99999-0000",
        email: "ana.silva@exemplo.com",
      },
    ],
    sport: {
      discipline: "basketball",
      primaryPosition: "point_guard",
      secondaryPositions: ["shooting_guard"],
      dominantSide: "right",
    },
    physicalProfile: {
      heightCm: 186,
      weightKg: 76,
      wingspanCm: 191,
    },
    category: "sub-17",
    education: {
      schoolName: "EE Prof. Carlos Andrade",
      gradeLevel: "2º ano EM",
      graduationYear: 2026,
      academicGoals: ["Engenharia — USP"],
    },
    career: {
      currentClub: "Paulistano Basquete",
      currentTeam: "Sub-17",
      coachName: "Rafael Monteiro",
      seasonGoals: [
        "Ir ao Campeonato Brasileiro Sub-17",
        "Média de 8 assistências por jogo",
      ],
      achievements: [
        "Campeão Paulista Sub-15 (2023)",
        "MVP do Torneio Metropolitano Sub-17 (2025)",
        "Convocado para seletiva da seleção sub-17 (2025)",
        "Melhor armador do Campeonato Paulista Sub-17 (2025)",
      ],
    },
    media: {
      highlightVideoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    },
    status: "active",
    consents: {
      termsAccepted: true,
      privacyAccepted: true,
      imageUseAccepted: true,
      minorConsentProvided: true,
      consentVersion: "2026-01",
      acceptedAt: "2026-01-15T12:00:00-03:00",
    },
    visibility: {
      publicProfileEnabled: true,
      discoverable: false,
      showPhoto: true,
      showAge: true,
      showCity: true,
      showPhysicalProfile: true,
      showHighlightVideos: true,
      showAchievements: true,
      showCurrentClub: true,
      showContact: false,
      showMatchStats: false,
      showAssessmentStats: false,
    },
    tags: ["point_guard", "sub-17", "sao-paulo"],
    createdAt: "2024-03-10T09:30:00-03:00",
    updatedAt: "2026-03-28T18:22:00-03:00",
  },
  {
    id: "b8c5d6e9-2f3a-5b4c-0d9e-1f2a3b4c5d6e",
    tenantId: "tenant-demo-individual",
    slug: "mariana-costa-2007",
    profile: {
      firstName: "Mariana",
      lastName: "Costa",
      birthDate: "2007-09-22",
      gender: "female",
      country: "BR",
      state: "RJ",
      city: "Niterói",
      nationality: "Brasileira / Angolana",
      photoUrl:
        "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=1600&q=80&auto=format&fit=crop",
      bio: "Ala-pivô de dupla nacionalidade (Brasil/Angola) formada nas categorias de base do clube desde os doze anos. Combina tamanho acima da média para a posição com agilidade de exterior — capaz de correr o contra-ataque, proteger o garrafão e finalizar de meia distância. Convocada para seletivas da seleção brasileira sub-17 em 2025. Estuda com bolsa integral em colégio particular e pretende seguir carreira universitária nos Estados Unidos.",
    },
    contact: {
      email: "mari.costa@exemplo.com",
      instagram: "@mari.costa.hoops",
    },
    sport: {
      discipline: "basketball",
      primaryPosition: "power_forward",
      secondaryPositions: ["small_forward"],
      dominantSide: "right",
    },
    physicalProfile: {
      heightCm: 188,
      weightKg: 74,
      wingspanCm: 193,
    },
    category: "sub-18",
    education: {
      schoolName: "Colégio São Vicente",
      gradeLevel: "3º ano EM",
      graduationYear: 2025,
      academicGoals: ["NCAA Division I — bolsa integral"],
    },
    career: {
      currentClub: "Fluminense Basquete Feminino",
      currentTeam: "Sub-18",
      coachName: "Patrícia Leão",
      seasonGoals: ["Top 5 nacional em rebotes", "Showcase internacional"],
      achievements: [
        "Vice-campeã do Brasileiro Sub-17 (2024)",
        "Selecionada para showcase FIBA Americas (2025)",
        "Melhor rebotedeira do Campeonato Carioca Sub-18 (2025)",
      ],
    },
    media: {
      highlightVideoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    },
    status: "active",
    consents: {
      termsAccepted: true,
      privacyAccepted: true,
      imageUseAccepted: true,
      minorConsentProvided: true,
      consentVersion: "2026-01",
      acceptedAt: "2026-02-02T10:00:00-03:00",
    },
    visibility: {
      publicProfileEnabled: true,
      discoverable: true,
      showPhoto: true,
      showAge: true,
      showCity: true,
      showPhysicalProfile: true,
      showHighlightVideos: true,
      showAchievements: true,
      showCurrentClub: true,
      showContact: true,
      showMatchStats: true,
      showAssessmentStats: true,
    },
    tags: ["power_forward", "sub-18", "rio-de-janeiro", "ncaa-bound"],
    createdAt: "2024-06-18T14:00:00-03:00",
    updatedAt: "2026-03-30T11:10:00-03:00",
  },
];
