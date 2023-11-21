const columns = [
  { name: 'PRESENTE', uid: 'status' },
  { name: 'NOME', uid: 'name', sortable: true },
];

const users = [
  {
    id: 1,
    name: 'Alice Silva',
    role: 'Rua da Escola, 123',
    email: 'alice.silva@example.com',
    escola: 'Colégio Fundação Bradesco',
  },
  {
    id: 2,
    name: 'João Silva',
    role: 'Travessa da Educação, 789',
    email: 'joao.silva@example.com',
    escola: 'Colégio Fundação Bradesco',
  },
  {
    id: 3,
    name: 'Maria Oliveira',
    role: 'Alameda do Saber, 101',
    email: 'maria.oliveira@example.com',
    escola: 'Colégio Fundação Bradesco',
  },
];

export { columns, users };
