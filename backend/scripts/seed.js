const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Confession = require('../models/Confession');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whisperwall');
    console.log('✅ Connected to MongoDB');

    // Drop collections to start fresh
    try {
      await mongoose.connection.collection('users').drop();
    } catch (e) {}
    try {
      await mongoose.connection.collection('confessions').drop();
    } catch (e) {}
    console.log('🗑️  Cleared existing collections');

    // Create sample users
    const users = await User.create([
      {
        email: 'student1@campus.edu',
        password: 'password123',
        displayName: 'Student #247',
        name: 'Alex J.',
        authMethod: 'email',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      {
        email: 'student2@campus.edu',
        password: 'password123',
        displayName: 'Student #892',
        name: 'Jordan M.',
        authMethod: 'email',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      },
      {
        email: 'student3@campus.edu',
        password: 'password123',
        displayName: 'Student #156',
        name: 'Casey L.',
        authMethod: 'email',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
      },
      {
        email: 'student4@campus.edu',
        password: 'password123',
        displayName: 'Student #734',
        name: 'Morgan P.',
        authMethod: 'email',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
      },
      {
        email: 'student5@campus.edu',
        password: 'password123',
        displayName: 'Student #521',
        name: 'Taylor R.',
        authMethod: 'email',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
      },
    ]);

    console.log('👥 Created sample users');

    // Create sample confessions
    const confessions = await Confession.create([
      {
        userId: users[0]._id,
        text: 'I have my finals tomorrow and I haven\'t started studying. I\'m just sitting here eating cereal and watching the ceiling fans spin.',
        secretCode: '5894',
        category: 'Study',
        hashtags: ['#finals_week', '#procrastination'],
        reactions: {
          like: 243,
          love: 12,
          laugh: 45,
        },
      },
      {
        userId: users[1]._id,
        text: 'To the guy in the blue hoodie at the library: I dropped my pen on purpose just so you\'d look at me. It worked, but then I tripped. 😅',
        secretCode: '2341',
        category: 'Crush',
        hashtags: ['#library_crush', '#awkward'],
        reactions: {
          like: 892,
          love: 234,
          laugh: 156,
        },
      },
      {
        userId: users[2]._id,
        text: 'I accidentally called my professor "mom" during lecture. Everyone heard it. I\'m thinking of changing universities.',
        secretCode: '7823',
        category: 'Funny',
        hashtags: ['#freudian_slip', '#embarrassed'],
        reactions: {
          like: 567,
          love: 89,
          laugh: 432,
        },
      },
      {
        userId: users[3]._id,
        text: 'My roommate keeps eating my leftovers from the fridge and blaming it on "someone else in the dorm." We live in a single room.',
        secretCode: '4562',
        category: 'Rant',
        hashtags: ['#roommate_drama', '#food_theft'],
        reactions: {
          like: 234,
          love: 45,
          laugh: 123,
        },
      },
      {
        userId: users[4]._id,
        text: 'I\'ve been pretending to sleep every morning so I can listen to my roommate sing in the shower. Their voice is angelic.',
        secretCode: '9281',
        category: 'Crush',
        hashtags: ['#silent_admirer', '#shower_concerts'],
        reactions: {
          like: 456,
          love: 567,
          laugh: 89,
        },
      },
      {
        userId: users[0]._id,
        text: 'The library coffee tastes like it was made in 2019, but I still buy it every day because the barista smiles at me.',
        secretCode: '1234',
        category: 'Crush',
        hashtags: ['#coffee_love', '#barista_crush'],
        reactions: {
          like: 678,
          love: 234,
          laugh: 56,
        },
      },
      {
        userId: users[1]._id,
        text: 'Spent £50 on a coffee every day this week. My budget is ruined but my caffeine addiction is thriving.',
        secretCode: '5566',
        category: 'Funny',
        hashtags: ['#coffee_addiction', '#broke_student'],
        reactions: {
          like: 445,
          love: 67,
          laugh: 289,
        },
      },
      {
        userId: users[2]._id,
        text: 'I\'m too scared to check my exam results. It\'s been three days. Send help.',
        secretCode: '7788',
        category: 'Study',
        hashtags: ['#exam_anxiety', '#scared'],
        reactions: {
          like: 234,
          love: 123,
          laugh: 34,
        },
      },
      {
        userId: users[3]._id,
        text: 'My group project partner hasn\'t responded in 2 weeks. I\'m considering doing the entire thing myself just to save my GPA.',
        secretCode: '9900',
        category: 'Rant',
        hashtags: ['#group_project_hell', '#unreliable'],
        reactions: {
          like: 567,
          love: 78,
          laugh: 123,
        },
      },
      {
        userId: users[4]._id,
        text: 'I got an A on the exam I thought I failed. Today is a good day.',
        secretCode: '1122',
        category: 'Study',
        hashtags: ['#unexpected_win', '#blessed'],
        reactions: {
          like: 789,
          love: 345,
          laugh: 23,
        },
      },
      {
        userId: users[0]._id,
        text: 'Wore the same outfit 3 days in a row. Nobody noticed. Testing this theory going forward.',
        secretCode: '3344',
        category: 'Funny',
        hashtags: ['#lazy_fashion', '#rewearing_clothes'],
        reactions: {
          like: 456,
          love: 89,
          laugh: 234,
        },
      },
      {
        userId: users[1]._id,
        text: 'Can we talk about how expensive textbooks are? I\'m pretty sure they cost more than my tuition.',
        secretCode: '5500',
        category: 'Rant',
        hashtags: ['#textbook_scam', '#broke'],
        reactions: {
          like: 678,
          love: 45,
          laugh: 12,
        },
      },
      {
        userId: users[2]._id,
        text: 'I sleep through my 10 AM class at least twice a week. Yet somehow I still get good grades. This confuses me.',
        secretCode: '7766',
        category: 'Funny',
        hashtags: ['#sleeping_through_class', '#blessed'],
        reactions: {
          like: 345,
          love: 234,
          laugh: 456,
        },
      },
      {
        userId: users[3]._id,
        text: 'The gym at peak hours is packed. I go at 6 AM to avoid crowds. Still waiting for someone to acknowledge my dedication.',
        secretCode: '8899',
        category: 'Funny',
        hashtags: ['#gym_early_bird', '#no_witnesses'],
        reactions: {
          like: 523,
          love: 67,
          laugh: 189,
        },
      },
      {
        userId: users[4]._id,
        text: 'Caught my crush looking at me three times in class today. Either they like me or I have food on my face. Probably the latter.',
        secretCode: '9944',
        category: 'Crush',
        hashtags: ['#might_be_paranoid', '#or_maybe'],
        reactions: {
          like: 734,
          love: 456,
          laugh: 234,
        },
      },
    ]);

    console.log('📝 Created sample confessions');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n--- Test Accounts ---');
    console.log('Email: student1@campus.edu | Password: password123');
    console.log('Email: student2@campus.edu | Password: password123');
    console.log('Email: student3@campus.edu | Password: password123');
    console.log('Email: student4@campus.edu | Password: password123');
    console.log('Email: student5@campus.edu | Password: password123');
    console.log('\n📊 Stats:');
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Confessions: ${confessions.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
