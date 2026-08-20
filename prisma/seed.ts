import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await hash('waynengeno', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rashidleaks.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@rashidleaks.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      displayName: 'RASHID LEAKS Admin',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      ageVerified: true,
      ageVerifiedAt: new Date(),
    },
  });

  console.log('✅ Admin user created:', {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
  });

  // Create sample categories
  const categories = [
    { name: 'Amateur', slug: 'amateur', icon: '🎥', isFeatured: true, sortOrder: 1 },
    { name: 'Professional', slug: 'professional', icon: '🎬', isFeatured: true, sortOrder: 2 },
    { name: 'Solo', slug: 'solo', icon: '✨', isFeatured: true, sortOrder: 3 },
    { name: 'Couple', slug: 'couple', icon: '💑', isFeatured: true, sortOrder: 4 },
    { name: 'Roleplay', slug: 'roleplay', icon: '🎭', isFeatured: false, sortOrder: 5 },
    { name: 'HD/4K', slug: 'hd-4k', icon: '📺', isFeatured: true, sortOrder: 6 },
    { name: 'Vintage', slug: 'vintage', icon: '📼', isFeatured: false, sortOrder: 7 },
    { name: 'Interactive', slug: 'interactive', icon: '🎮', isFeatured: false, sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created:', categories.length);

  // Create sample tags
  const tags = ['premium', 'hd', 'exclusive', 'trending', 'new', 'popular', 'verified'];
  
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName, slug: tagName.toLowerCase() },
    });
  }

  console.log('✅ Tags created:', tags.length);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
