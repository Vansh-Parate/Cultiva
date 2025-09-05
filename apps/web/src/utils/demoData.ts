export const demoTasks = [
  { id: 't1', plantName: 'Monstera', type: 'Water', frequency: 'weekly', dueDate: new Date().toISOString(), notes: 'Check soil moisture first · Living room', priority: 'high', completed: false },
  { id: 't2', plantName: 'Calathea', type: 'Mist', frequency: 'daily', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Humidity boost · Bedroom', priority: 'medium', completed: false },
  { id: 't3', plantName: 'Pothos', type: 'Fertilize', frequency: 'monthly', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Monthly in spring · Kitchen', priority: 'low', completed: false },
];

export const demoPlants = [
  { id: 'p1', name: 'Monstera', species: { commonName: 'Monstera deliciosa' }, images: [{ imageUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=800&q=80', isPrimary: true }], location: 'Living room · Bright, indirect' },
  { id: 'p2', name: 'ZZ Plant', species: { commonName: 'Zamioculcas zamiifolia' }, images: [{ imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1400&auto=format&fit=crop', isPrimary: true }], location: 'Hallway · Easy' },
  { id: 'p3', name: 'Golden Pothos', species: { commonName: 'Epipremnum aureum' }, images: [{ imageUrl: 'https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=800&q=80', isPrimary: true }], location: 'Kitchen · Trailing' },
  { id: 'p4', name: 'Calathea', species: { commonName: 'Calathea orbifolia' }, images: [{ imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', isPrimary: true }], location: 'Bedroom · Humidity lover' },
];

export const demoPosts = [
  { id: 'post1', title: 'New leaf unfurling!', content: '', imageUrls: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop'], createdAt: new Date().toISOString(), user: { username: 'Maya', avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=80&auto=format&fit=crop' }, likes: Array(128).fill(0), comments: Array(18).fill(0) },
  { id: 'post2', title: 'Best soil mix for ZZ?', content: '', imageUrls: [], createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), user: { username: 'Leo', avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=80&auto=format&fit=crop' }, likes: [], comments: [] },
];



