// Seed users. On first load these are copied into localStorage ("users"),
// and every new signup is appended there. This is a DEMO ONLY: passwords are
// stored in plain text because there is no backend. Never do this in production.
const users = [
  {
    id: 1,
    name: 'Demo Shopper',
    email: 'demo@praharx.com',
    password: 'demo1234',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export default users;
