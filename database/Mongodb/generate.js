const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://amardatabase:amardatabase@cluster0.gjuunff.mongodb.net/';
const DB_NAME = 'mydb';

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  console.log('Connected to MongoDB');

  // Drop old collections
  const collections = ['users', 'products', 'orders', 'reviews', 'categories'];
  for (const col of collections) {
    await db.collection(col).drop().catch(() => {});
  }

  // ========== 1. Categories (5 documents) ==========
  await db.collection('categories').insertMany([
    { _id: 1, name: 'Electronics', subCategories: ['Mobiles', 'Laptops', 'Accessories'] },
    { _id: 2, name: 'Clothing', subCategories: ['Men', 'Women', 'Kids'] },
    { _id: 3, name: 'Home', subCategories: ['Furniture', 'Kitchen', 'Decor'] },
    { _id: 4, name: 'Books', subCategories: ['Fiction', 'Non-Fiction'] },
    { _id: 5, name: 'Sports', subCategories: ['Fitness', 'Outdoor'] }
  ]);
  console.log('✓ categories inserted');

  // ========== 2. Users (12 documents) - Nested objects + arrays ==========
  await db.collection('users').insertMany([
    {
      _id: 1,
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav@email.com',
      isActive: true,
      address: {
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      preferences: {
        language: 'en',
        notifications: { email: true, sms: false, push: true },
        favoriteCategories: [1, 3]
      },
      paymentMethods: [
        { type: 'card', last4: '4242', provider: 'Visa', isDefault: true },
        { type: 'upi', last4: null, provider: 'PhonePe', isDefault: false }
      ]
    },
    {
      _id: 2,
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya@email.com',
      isActive: true,
      address: {
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        coordinates: { lat: 23.0225, lng: 72.5714 }
      },
      preferences: {
        language: 'hi',
        notifications: { email: true, sms: true, push: false },
        favoriteCategories: [2, 4]
      },
      paymentMethods: [
        { type: 'upi', last4: null, provider: 'GPay', isDefault: true }
      ]
    },
    {
      _id: 3,
      firstName: 'Rohan',
      lastName: 'Gupta',
      email: 'rohan@email.com',
      isActive: true,
      address: {
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        coordinates: { lat: 12.9716, lng: 77.5946 }
      },
      preferences: {
        language: 'en',
        notifications: { email: false, sms: true, push: true },
        favoriteCategories: [1, 5]
      },
      paymentMethods: [
        { type: 'card', last4: '1111', provider: 'Mastercard', isDefault: true },
        { type: 'wallet', last4: null, provider: 'Paytm', isDefault: false }
      ]
    },
    {
      _id: 4,
      firstName: 'Sneha',
      lastName: 'Reddy',
      email: 'sneha@email.com',
      isActive: false,
      address: {
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        coordinates: { lat: 17.3850, lng: 78.4867 }
      },
      preferences: {
        language: 'te',
        notifications: { email: true, sms: false, push: false },
        favoriteCategories: [2]
      },
      paymentMethods: []
    },
    {
      _id: 5,
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram@email.com',
      isActive: true,
      address: {
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        coordinates: { lat: 28.7041, lng: 77.1025 }
      },
      preferences: {
        language: 'hi',
        notifications: { email: true, sms: true, push: true },
        favoriteCategories: [1, 2, 3]
      },
      paymentMethods: [
        { type: 'card', last4: '9999', provider: 'RuPay', isDefault: true }
      ]
    },
    {
      _id: 6,
      firstName: 'Ananya',
      lastName: 'Iyer',
      email: 'ananya@email.com',
      isActive: true,
      address: {
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        coordinates: { lat: 13.0827, lng: 80.2707 }
      },
      preferences: {
        language: 'ta',
        notifications: { email: true, sms: false, push: true },
        favoriteCategories: [4, 5]
      },
      paymentMethods: [
        { type: 'upi', last4: null, provider: 'PhonePe', isDefault: true },
        { type: 'card', last4: '5555', provider: 'Visa', isDefault: false }
      ]
    },
    {
      _id: 7,
      firstName: 'Karan',
      lastName: 'Mehta',
      email: 'karan@email.com',
      isActive: true,
      address: {
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        coordinates: { lat: 18.5204, lng: 73.8567 }
      },
      preferences: {
        language: 'en',
        notifications: { email: false, sms: false, push: true },
        favoriteCategories: [1]
      },
      paymentMethods: [
        { type: 'wallet', last4: null, provider: 'Amazon Pay', isDefault: true }
      ]
    },
    {
      _id: 8,
      firstName: 'Neha',
      lastName: 'Joshi',
      email: 'neha@email.com',
      isActive: true,
      address: {
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        coordinates: { lat: 26.9124, lng: 75.7873 }
      },
      preferences: {
        language: 'hi',
        notifications: { email: true, sms: true, push: false },
        favoriteCategories: [2, 3]
      },
      paymentMethods: [
        { type: 'card', last4: '3333', provider: 'Mastercard', isDefault: true }
      ]
    },
    {
      _id: 9,
      firstName: 'Aditya',
      lastName: 'Nair',
      email: 'aditya@email.com',
      isActive: true,
      address: {
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001',
        coordinates: { lat: 9.9312, lng: 76.2673 }
      },
      preferences: {
        language: 'en',
        notifications: { email: true, sms: false, push: true },
        favoriteCategories: [5]
      },
      paymentMethods: [
        { type: 'upi', last4: null, provider: 'GPay', isDefault: true }
      ]
    },
    {
      _id: 10,
      firstName: 'Meera',
      lastName: 'Desai',
      email: 'meera@email.com',
      isActive: false,
      address: {
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395001',
        coordinates: { lat: 21.1702, lng: 72.8311 }
      },
      preferences: {
        language: 'gu',
        notifications: { email: false, sms: true, push: false },
        favoriteCategories: [2]
      },
      paymentMethods: []
    },
    {
      _id: 11,
      firstName: 'Dev',
      lastName: 'Chopra',
      email: 'dev@email.com',
      isActive: true,
      address: {
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001',
        coordinates: { lat: 22.5726, lng: 88.3639 }
      },
      preferences: {
        language: 'bn',
        notifications: { email: true, sms: true, push: true },
        favoriteCategories: [1, 4]
      },
      paymentMethods: [
        { type: 'card', last4: '7777', provider: 'Visa', isDefault: true },
        { type: 'upi', last4: null, provider: 'Paytm', isDefault: false }
      ]
    },
    {
      _id: 12,
      firstName: 'Isha',
      lastName: 'Banerjee',
      email: 'isha@email.com',
      isActive: true,
      address: {
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001',
        coordinates: { lat: 26.8467, lng: 80.9462 }
      },
      preferences: {
        language: 'hi',
        notifications: { email: true, sms: false, push: true },
        favoriteCategories: [3, 5]
      },
      paymentMethods: [
        { type: 'upi', last4: null, provider: 'PhonePe', isDefault: true }
      ]
    }
  ]);
  console.log('✓ users inserted (12 documents)');

  // ========== 3. Products (12 documents) - Nested objects + arrays ==========
  await db.collection('products').insertMany([
    {
      _id: 1,
      name: 'iPhone 15 Pro',
      categoryId: 1,
      brand: 'Apple',
      price: 134900,
      stock: 45,
      rating: 4.8,
      tags: ['bestseller', 'premium', 'new'],
      specs: {
        weight: '187g',
        color: 'Natural Titanium',
        storage: '256GB',
        dimensions: { length: 14.67, width: 7.09, height: 0.83 }
      },
      variants: [
        { sku: 'IP15P-256-NAT', color: 'Natural Titanium', storage: '256GB', price: 134900, stock: 20 },
        { sku: 'IP15P-512-BLU', color: 'Blue Titanium', storage: '512GB', price: 154900, stock: 15 },
        { sku: 'IP15P-1TB-BLK', color: 'Black Titanium', storage: '1TB', price: 174900, stock: 10 }
      ]
    },
    {
      _id: 2,
      name: 'Samsung Galaxy S24',
      categoryId: 1,
      brand: 'Samsung',
      price: 79999,
      stock: 60,
      rating: 4.6,
      tags: ['bestseller', 'android'],
      specs: {
        weight: '167g',
        color: 'Onyx Black',
        storage: '256GB',
        dimensions: { length: 14.7, width: 7.06, height: 0.76 }
      },
      variants: [
        { sku: 'S24-256-BLK', color: 'Onyx Black', storage: '256GB', price: 79999, stock: 30 },
        { sku: 'S24-512-VIO', color: 'Marble Gray', storage: '512GB', price: 89999, stock: 30 }
      ]
    },
    {
      _id: 3,
      name: 'Nike Air Max',
      categoryId: 2,
      brand: 'Nike',
      price: 8999,
      stock: 120,
      rating: 4.5,
      tags: ['sports', 'trending'],
      specs: {
        weight: '320g',
        color: 'White/Black',
        material: 'Mesh',
        dimensions: { length: 30, width: 12, height: 12 }
      },
      variants: [
        { sku: 'NAM-8-WHT', color: 'White', size: '8', price: 8999, stock: 40 },
        { sku: 'NAM-9-BLK', color: 'Black', size: '9', price: 8999, stock: 50 },
        { sku: 'NAM-10-RED', color: 'Red', size: '10', price: 9499, stock: 30 }
      ]
    },
    {
      _id: 4,
      name: 'Sony WH-1000XM5',
      categoryId: 1,
      brand: 'Sony',
      price: 29990,
      stock: 80,
      rating: 4.7,
      tags: ['premium', 'audio'],
      specs: {
        weight: '250g',
        color: 'Black',
        battery: '30 hours',
        dimensions: { length: 20, width: 18, height: 8 }
      },
      variants: [
        { sku: 'XM5-BLK', color: 'Black', price: 29990, stock: 50 },
        { sku: 'XM5-SLV', color: 'Silver', price: 29990, stock: 30 }
      ]
    },
    {
      _id: 5,
      name: 'The Alchemist',
      categoryId: 4,
      brand: 'HarperCollins',
      price: 299,
      stock: 200,
      rating: 4.9,
      tags: ['bestseller', 'fiction'],
      specs: {
        weight: '200g',
        pages: 208,
        language: 'English',
        dimensions: { length: 20, width: 13, height: 1.5 }
      },
      variants: []
    },
    {
      _id: 6,
      name: 'Wooden Study Table',
      categoryId: 3,
      brand: 'Hometown',
      price: 12499,
      stock: 35,
      rating: 4.3,
      tags: ['furniture', 'home'],
      specs: {
        weight: '25kg',
        color: 'Walnut',
        material: 'Sheesham Wood',
        dimensions: { length: 120, width: 60, height: 75 }
      },
      variants: [
        { sku: 'WST-WAL', color: 'Walnut', price: 12499, stock: 20 },
        { sku: 'WST-OAK', color: 'Oak', price: 13499, stock: 15 }
      ]
    },
    {
      _id: 7,
      name: 'Yoga Mat Premium',
      categoryId: 5,
      brand: 'Strauss',
      price: 999,
      stock: 150,
      rating: 4.4,
      tags: ['fitness', 'budget'],
      specs: {
        weight: '1.2kg',
        color: 'Purple',
        thickness: '8mm',
        dimensions: { length: 183, width: 61, height: 0.8 }
      },
      variants: [
        { sku: 'YM-PUR', color: 'Purple', price: 999, stock: 60 },
        { sku: 'YM-BLU', color: 'Blue', price: 999, stock: 50 },
        { sku: 'YM-GRN', color: 'Green', price: 999, stock: 40 }
      ]
    },
    {
      _id: 8,
      name: 'Levi\'s 511 Jeans',
      categoryId: 2,
      brand: 'Levi\'s',
      price: 2999,
      stock: 90,
      rating: 4.5,
      tags: ['clothing', 'bestseller'],
      specs: {
        weight: '500g',
        color: 'Dark Blue',
        material: 'Denim',
        dimensions: { length: 100, width: 40, height: 2 }
      },
      variants: [
        { sku: 'L511-30', color: 'Dark Blue', size: '30', price: 2999, stock: 30 },
        { sku: 'L511-32', color: 'Dark Blue', size: '32', price: 2999, stock: 35 },
        { sku: 'L511-34', color: 'Black', size: '34', price: 3199, stock: 25 }
      ]
    },
    {
      _id: 9,
      name: 'MacBook Air M2',
      categoryId: 1,
      brand: 'Apple',
      price: 99900,
      stock: 25,
      rating: 4.9,
      tags: ['premium', 'laptop'],
      specs: {
        weight: '1.24kg',
        color: 'Midnight',
        storage: '256GB',
        dimensions: { length: 30.41, width: 21.5, height: 1.13 }
      },
      variants: [
        { sku: 'MBA-M2-256', color: 'Midnight', storage: '256GB', price: 99900, stock: 15 },
        { sku: 'MBA-M2-512', color: 'Starlight', storage: '512GB', price: 119900, stock: 10 }
      ]
    },
    {
      _id: 10,
      name: 'Atomic Habits',
      categoryId: 4,
      brand: 'Penguin',
      price: 450,
      stock: 180,
      rating: 4.8,
      tags: ['non-fiction', 'bestseller'],
      specs: {
        weight: '300g',
        pages: 320,
        language: 'English',
        dimensions: { length: 21, width: 14, height: 2 }
      },
      variants: []
    },
    {
      _id: 11,
      name: 'Boat Airdopes 141',
      categoryId: 1,
      brand: 'boAt',
      price: 1299,
      stock: 300,
      rating: 4.2,
      tags: ['budget', 'audio', 'trending'],
      specs: {
        weight: '45g',
        color: 'Black',
        battery: '42 hours',
        dimensions: { length: 5, width: 4, height: 3 }
      },
      variants: [
        { sku: 'BA141-BLK', color: 'Black', price: 1299, stock: 150 },
        { sku: 'BA141-WHT', color: 'White', price: 1299, stock: 100 },
        { sku: 'BA141-BLU', color: 'Blue', price: 1399, stock: 50 }
      ]
    },
    {
      _id: 12,
      name: 'Decathlon Dumbbell Set',
      categoryId: 5,
      brand: 'Decathlon',
      price: 2499,
      stock: 70,
      rating: 4.6,
      tags: ['fitness', 'home'],
      specs: {
        weight: '10kg',
        color: 'Black',
        material: 'Cast Iron',
        dimensions: { length: 30, width: 15, height: 15 }
      },
      variants: [
        { sku: 'DB-5KG', weight: '5kg pair', price: 1499, stock: 30 },
        { sku: 'DB-10KG', weight: '10kg pair', price: 2499, stock: 25 },
        { sku: 'DB-15KG', weight: '15kg pair', price: 3499, stock: 15 }
      ]
    }
  ]);
  console.log('✓ products inserted (12 documents)');

  // ========== 4. Orders (15 documents) - Nested items array + nested objects ==========
  await db.collection('orders').insertMany([
    {
      _id: 1001,
      userId: 1,
      orderDate: new Date('2025-01-15'),
      status: 'delivered',
      totalAmount: 137899,
      items: [
        { productId: 1, quantity: 1, unitPrice: 134900, lineTotal: 134900, selectedVariant: { color: 'Natural Titanium', storage: '256GB' } },
        { productId: 11, quantity: 2, unitPrice: 1299, lineTotal: 2598, selectedVariant: { color: 'Black' } }
      ],
      shipping: {
        method: 'express',
        cost: 99,
        address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1001ABC',
        paidAt: new Date('2025-01-15')
      }
    },
    {
      _id: 1002,
      userId: 2,
      orderDate: new Date('2025-02-03'),
      status: 'delivered',
      totalAmount: 9298,
      items: [
        { productId: 3, quantity: 1, unitPrice: 8999, lineTotal: 8999, selectedVariant: { color: 'White', size: '8' } },
        { productId: 7, quantity: 1, unitPrice: 999, lineTotal: 999, selectedVariant: { color: 'Purple' } }
      ],
      shipping: {
        method: 'standard',
        cost: 49,
        address: { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }
      },
      payment: {
        method: 'upi',
        status: 'paid',
        transactionId: 'TXN1002XYZ',
        paidAt: new Date('2025-02-03')
      }
    },
    {
      _id: 1003,
      userId: 3,
      orderDate: new Date('2025-02-20'),
      status: 'shipped',
      totalAmount: 82998,
      items: [
        { productId: 2, quantity: 1, unitPrice: 79999, lineTotal: 79999, selectedVariant: { color: 'Onyx Black', storage: '256GB' } },
        { productId: 11, quantity: 2, unitPrice: 1299, lineTotal: 2598, selectedVariant: { color: 'White' } }
      ],
      shipping: {
        method: 'express',
        cost: 149,
        address: { city: 'Bangalore', state: 'Karnataka', pincode: '560001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1003DEF',
        paidAt: new Date('2025-02-20')
      }
    },
    {
      _id: 1004,
      userId: 1,
      orderDate: new Date('2025-03-05'),
      status: 'delivered',
      totalAmount: 29990,
      items: [
        { productId: 4, quantity: 1, unitPrice: 29990, lineTotal: 29990, selectedVariant: { color: 'Black' } }
      ],
      shipping: {
        method: 'standard',
        cost: 0,
        address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      },
      payment: {
        method: 'upi',
        status: 'paid',
        transactionId: 'TXN1004GHI',
        paidAt: new Date('2025-03-05')
      }
    },
    {
      _id: 1005,
      userId: 5,
      orderDate: new Date('2025-03-18'),
      status: 'cancelled',
      totalAmount: 12499,
      items: [
        { productId: 6, quantity: 1, unitPrice: 12499, lineTotal: 12499, selectedVariant: { color: 'Walnut' } }
      ],
      shipping: {
        method: 'standard',
        cost: 199,
        address: { city: 'Delhi', state: 'Delhi', pincode: '110001' }
      },
      payment: {
        method: 'cod',
        status: 'pending',
        transactionId: null,
        paidAt: null
      }
    },
    {
      _id: 1006,
      userId: 6,
      orderDate: new Date('2025-04-02'),
      status: 'delivered',
      totalAmount: 749,
      items: [
        { productId: 5, quantity: 1, unitPrice: 299, lineTotal: 299 },
        { productId: 10, quantity: 1, unitPrice: 450, lineTotal: 450 }
      ],
      shipping: {
        method: 'standard',
        cost: 40,
        address: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' }
      },
      payment: {
        method: 'upi',
        status: 'paid',
        transactionId: 'TXN1006JKL',
        paidAt: new Date('2025-04-02')
      }
    },
    {
      _id: 1007,
      userId: 7,
      orderDate: new Date('2025-04-15'),
      status: 'processing',
      totalAmount: 99900,
      items: [
        { productId: 9, quantity: 1, unitPrice: 99900, lineTotal: 99900, selectedVariant: { color: 'Midnight', storage: '256GB' } }
      ],
      shipping: {
        method: 'express',
        cost: 0,
        address: { city: 'Pune', state: 'Maharashtra', pincode: '411001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1007MNO',
        paidAt: new Date('2025-04-15')
      }
    },
    {
      _id: 1008,
      userId: 8,
      orderDate: new Date('2025-05-01'),
      status: 'delivered',
      totalAmount: 5998,
      items: [
        { productId: 8, quantity: 2, unitPrice: 2999, lineTotal: 5998, selectedVariant: { color: 'Dark Blue', size: '32' } }
      ],
      shipping: {
        method: 'standard',
        cost: 49,
        address: { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1008PQR',
        paidAt: new Date('2025-05-01')
      }
    },
    {
      _id: 1009,
      userId: 3,
      orderDate: new Date('2025-05-22'),
      status: 'shipped',
      totalAmount: 2499,
      items: [
        { productId: 12, quantity: 1, unitPrice: 2499, lineTotal: 2499, selectedVariant: { weight: '10kg pair' } }
      ],
      shipping: {
        method: 'standard',
        cost: 99,
        address: { city: 'Bangalore', state: 'Karnataka', pincode: '560001' }
      },
      payment: {
        method: 'upi',
        status: 'paid',
        transactionId: 'TXN1009STU',
        paidAt: new Date('2025-05-22')
      }
    },
    {
      _id: 1010,
      userId: 9,
      orderDate: new Date('2025-06-10'),
      status: 'delivered',
      totalAmount: 1299,
      items: [
        { productId: 11, quantity: 1, unitPrice: 1299, lineTotal: 1299, selectedVariant: { color: 'Blue' } }
      ],
      shipping: {
        method: 'standard',
        cost: 40,
        address: { city: 'Kochi', state: 'Kerala', pincode: '682001' }
      },
      payment: {
        method: 'upi',
        status: 'paid',
        transactionId: 'TXN1010VWX',
        paidAt: new Date('2025-06-10')
      }
    },
    {
      _id: 1011,
      userId: 11,
      orderDate: new Date('2025-06-25'),
      status: 'delivered',
      totalAmount: 137200,
      items: [
        { productId: 1, quantity: 1, unitPrice: 134900, lineTotal: 134900, selectedVariant: { color: 'Blue Titanium', storage: '512GB' } },
        { productId: 5, quantity: 1, unitPrice: 299, lineTotal: 299 },
        { productId: 10, quantity: 2, unitPrice: 450, lineTotal: 900 }
      ],
      shipping: {
        method: 'express',
        cost: 0,
        address: { city: 'Kolkata', state: 'West Bengal', pincode: '700001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1011YZA',
        paidAt: new Date('2025-06-25')
      }
    },
    {
      _id: 1012,
      userId: 12,
      orderDate: new Date('2025-07-08'),
      status: 'processing',
      totalAmount: 3998,
      items: [
        { productId: 7, quantity: 2, unitPrice: 999, lineTotal: 1998, selectedVariant: { color: 'Green' } },
        { productId: 3, quantity: 1, unitPrice: 8999, lineTotal: 8999, selectedVariant: { color: 'Black', size: '9' } }
      ],
      shipping: {
        method: 'standard',
        cost: 79,
        address: { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' }
      },
      payment: {
        method: 'cod',
        status: 'pending',
        transactionId: null,
        paidAt: null
      }
    },
    {
      _id: 1013,
      userId: 4,
      orderDate: new Date('2025-07-20'),
      status: 'returned',
      totalAmount: 2999,
      items: [
        { productId: 8, quantity: 1, unitPrice: 2999, lineTotal: 2999, selectedVariant: { color: 'Black', size: '34' } }
      ],
      shipping: {
        method: 'standard',
        cost: 49,
        address: { city: 'Hyderabad', state: 'Telangana', pincode: '500001' }
      },
      payment: {
        method: 'upi',
        status: 'refunded',
        transactionId: 'TXN1013BCD',
        paidAt: new Date('2025-07-20')
      }
    },
    {
      _id: 1014,
      userId: 5,
      orderDate: new Date('2025-08-05'),
      status: 'delivered',
      totalAmount: 154900,
      items: [
        { productId: 1, quantity: 1, unitPrice: 154900, lineTotal: 154900, selectedVariant: { color: 'Blue Titanium', storage: '512GB' } }
      ],
      shipping: {
        method: 'express',
        cost: 0,
        address: { city: 'Delhi', state: 'Delhi', pincode: '110001' }
      },
      payment: {
        method: 'card',
        status: 'paid',
        transactionId: 'TXN1014EFG',
        paidAt: new Date('2025-08-05')
      }
    },
    {
      _id: 1015,
      userId: 2,
      orderDate: new Date('2025-08-18'),
      status: 'pending',
      totalAmount: 3499,
      items: [
        { productId: 12, quantity: 1, unitPrice: 3499, lineTotal: 3499, selectedVariant: { weight: '15kg pair' } }
      ],
      shipping: {
        method: 'standard',
        cost: 99,
        address: { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }
      },
      payment: {
        method: 'cod',
        status: 'pending',
        transactionId: null,
        paidAt: null
      }
    }
  ]);
  console.log('✓ orders inserted (15 documents)');

  // ========== 5. Reviews (12 documents) - Nested replies array ==========
  await db.collection('reviews').insertMany([
    {
      _id: 1,
      productId: 1,
      userId: 1,
      rating: 5,
      title: 'Best phone ever!',
      comment: 'Camera is outstanding and battery lasts all day.',
      createdAt: new Date('2025-01-20'),
      helpfulVotes: 45,
      verifiedPurchase: true,
      replies: [
        { userId: 3, comment: 'Totally agree!', createdAt: new Date('2025-01-21'), isSeller: false },
        { userId: 0, comment: 'Thank you for your feedback!', createdAt: new Date('2025-01-22'), isSeller: true }
      ]
    },
    {
      _id: 2,
      productId: 2,
      userId: 3,
      rating: 4,
      title: 'Great Android flagship',
      comment: 'Smooth performance, good camera. A bit expensive though.',
      createdAt: new Date('2025-02-25'),
      helpfulVotes: 28,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 3,
      productId: 3,
      userId: 2,
      rating: 5,
      title: 'Very comfortable',
      comment: 'Perfect for daily running.',
      createdAt: new Date('2025-02-10'),
      helpfulVotes: 15,
      verifiedPurchase: true,
      replies: [
        { userId: 8, comment: 'Which size did you buy?', createdAt: new Date('2025-02-11'), isSeller: false }
      ]
    },
    {
      _id: 4,
      productId: 4,
      userId: 1,
      rating: 5,
      title: 'Noise cancellation is magic',
      comment: 'Best headphones I have ever used.',
      createdAt: new Date('2025-03-10'),
      helpfulVotes: 62,
      verifiedPurchase: true,
      replies: [
        { userId: 0, comment: 'Glad you liked it!', createdAt: new Date('2025-03-11'), isSeller: true }
      ]
    },
    {
      _id: 5,
      productId: 5,
      userId: 6,
      rating: 5,
      title: 'Must read',
      comment: 'Life changing book.',
      createdAt: new Date('2025-04-05'),
      helpfulVotes: 89,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 6,
      productId: 6,
      userId: 5,
      rating: 3,
      title: 'Average quality',
      comment: 'Looks good but finishing could be better.',
      createdAt: new Date('2025-03-25'),
      helpfulVotes: 7,
      verifiedPurchase: false,
      replies: []
    },
    {
      _id: 7,
      productId: 9,
      userId: 7,
      rating: 5,
      title: 'Insanely fast',
      comment: 'M2 chip is a beast. Battery life is excellent.',
      createdAt: new Date('2025-04-20'),
      helpfulVotes: 34,
      verifiedPurchase: true,
      replies: [
        { userId: 11, comment: 'How is the keyboard?', createdAt: new Date('2025-04-21'), isSeller: false }
      ]
    },
    {
      _id: 8,
      productId: 11,
      userId: 9,
      rating: 4,
      title: 'Value for money',
      comment: 'Good bass, battery is decent for the price.',
      createdAt: new Date('2025-06-15'),
      helpfulVotes: 21,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 9,
      productId: 1,
      userId: 11,
      rating: 5,
      title: 'Premium feel',
      comment: 'Titanium build feels amazing in hand.',
      createdAt: new Date('2025-07-01'),
      helpfulVotes: 19,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 10,
      productId: 8,
      userId: 8,
      rating: 4,
      title: 'Classic fit',
      comment: 'True to size, good quality denim.',
      createdAt: new Date('2025-05-08'),
      helpfulVotes: 12,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 11,
      productId: 12,
      userId: 3,
      rating: 5,
      title: 'Solid build',
      comment: 'Perfect for home workouts.',
      createdAt: new Date('2025-05-28'),
      helpfulVotes: 8,
      verifiedPurchase: true,
      replies: []
    },
    {
      _id: 12,
      productId: 10,
      userId: 6,
      rating: 5,
      title: 'Highly recommended',
      comment: 'Practical and easy to implement advice.',
      createdAt: new Date('2025-04-12'),
      helpfulVotes: 41,
      verifiedPurchase: true,
      replies: [
        { userId: 2, comment: 'I loved this book too!', createdAt: new Date('2025-04-13'), isSeller: false }
      ]
    }
  ]);
  console.log('✓ reviews inserted (12 documents)');

  console.log('\n=================================');
  console.log('Small sample dataset ready!');
  console.log('Database: practice_db');
  console.log('Collections: users, products, orders, reviews, categories');
  console.log('Each collection has 5–15 documents with nested objects & arrays');
  console.log('=================================');

  await client.close();
}

main().catch(console.error);