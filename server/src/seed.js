const bcrypt = require('bcryptjs');
const axios = require('axios');
const { sequelize, User, Product } = require('./models/index');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const fallbackProducts = [
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Soft, breathable cotton tee. Great for everyday wear.',
    price: 19.99,
    category: 'Clothes',
    stock: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1520975869010-6dd15c9d43e4?auto=format&fit=crop&w=900&q=60',
  },
  {
    name: 'Noise-Canceling Headphones',
    description: 'Comfort fit with active noise cancellation and deep bass.',
    price: 129.0,
    category: 'Electronics',
    stock: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=60',
  },
  {
    name: 'Modern Desk Lamp',
    description: 'Minimal LED lamp with warm light and adjustable arm.',
    price: 34.5,
    category: 'Furniture',
    stock: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=60',
  },
  {
    name: 'Everyday Sneakers',
    description: 'Lightweight sneakers with cushioned sole for all-day comfort.',
    price: 59.99,
    category: 'Accessories',
    stock: 85,
    imageUrl:
      'https://images.unsplash.com/photo-1528701800489-20be3c92dc28?auto=format&fit=crop&w=900&q=60',
  },
  {
    name: 'Bestselling Novel',
    description: 'A fast-paced page-turner you can’t put down.',
    price: 14.25,
    category: 'Books',
    stock: 200,
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=60',
  },
];

const kaggleCsvPath = path.join(__dirname, '../data/kaggle/flipkart_com-ecommerce_sample.csv');

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseImageUrl(imageField) {
  if (!imageField) return null;
  const s = String(imageField).trim();
  // Field looks like: ["http://...", "http://..."]
  // Sometimes it's already a url, sometimes malformed JSON. Try JSON first.
  try {
    const arr = JSON.parse(s);
    if (Array.isArray(arr) && arr.length > 0) return arr[0] || null;
  } catch (e) {
    // ignore
  }
  const m = s.match(/https?:\/\/[^"'\s\]]+/);
  return m ? m[0] : null;
}

function categoryFromTree(treeField) {
  if (!treeField) return null;
  // Example: ["Clothing >> Women's Clothing >> ..."]
  const s = String(treeField);
  const cleaned = s.replace(/^\s*\[\s*"+/g, '').replace(/"+\s*\]\s*$/g, '');
  const first = cleaned.split('>>')[0]?.trim();
  return first || null;
}

async function loadProductsFromKaggleCsv(limit = 500) {
  if (!fs.existsSync(kaggleCsvPath)) return [];
  const csv = fs.readFileSync(kaggleCsvPath, 'utf8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  const mapped = [];
  for (const r of records) {
    const name = (r.product_name || '').trim();
    if (!name) continue;
    const price =
      safeNumber(r.discounted_price) ??
      safeNumber(r.retail_price) ??
      0;
    mapped.push({
      name,
      description: (r.description || '').slice(0, 4000) || null,
      price,
      category: categoryFromTree(r.product_category_tree) || (r.brand ? String(r.brand) : null),
      stock: 50, // dataset doesn't include stock; use a reasonable default
      imageUrl: parseImageUrl(r.image),
    });
    if (mapped.length >= limit) break;
  }
  return mapped;
}

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
      googleId: 'google_id_admin_123',
    });

    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      isAdmin: false,
      googleId: 'google_id_john_456',
    });

    console.log('Users seeded (admin@example.com / admin123, john@example.com / user123)');

    // Prefer Kaggle CSV if present
    const kaggleProducts = await loadProductsFromKaggleCsv(500);
    if (kaggleProducts.length > 0) {
      await Product.bulkCreate(kaggleProducts);
      console.log(`Products seeded from Kaggle CSV (${kaggleProducts.length} items).`);
      process.exit();
    }

    // Fetch products from external API
    let externalProducts = [];
    try {
      const { data } = await axios.get('https://dummyjson.com/products?limit=50', {
        timeout: 8000,
        headers: { Accept: 'application/json' },
      });
      externalProducts = Array.isArray(data.products) ? data.products : [];
    } catch (err) {
      console.warn('External product seed failed, using fallback products.');
      externalProducts = [];
    }

    const products =
      externalProducts.length > 0
        ? externalProducts.map((p) => ({
            name: p.title,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: p.stock ?? 0,
            imageUrl: (p.images && p.images[0]) || p.thumbnail || null,
          }))
        : fallbackProducts;

    await Product.bulkCreate(products);
    console.log(`Products seeded (${products.length} items).`);

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
