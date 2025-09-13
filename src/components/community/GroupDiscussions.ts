export interface CommunityPost {
  id: string;
  avatar: string;
  name: string;
  badge: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  tags: string[];
  isNew?: boolean;
  achievement?: string;
}

export const groupDiscussions: Record<string, CommunityPost[]> = {
  'ttc-journey-support': [
    {
      id: '1',
      avatar: 'ER',
      name: 'Emma Rodriguez',
      badge: 'TTC 8 months',
      time: '2 hours ago',
      content: 'Hey beautiful souls 💫 Just finished my morning yoga flow and honestly, starting my day with intention has been a game-changer for my TTC journey. Some days are harder than others, but I\'m learning to honor wherever I am in this process. Anyone else finding peace in morning rituals? Would love to hear what centering practices are helping you! ✨',
      likes: 0,
      comments: 0,
      tags: ['TTC Support', 'Morning Rituals', 'Mindfulness'],
      achievement: ''
    },
    {
      id: '2',
      avatar: 'SL',
      name: 'Sofia Lopez',
      badge: 'TTC 4 months',
      time: '5 hours ago',
      content: 'Authenticity moment: CD1 hit me hard today and I spent a good 20 minutes crying in my car after work 😢 But then I remembered something my therapist said - every emotion is valid and deserves space. Making myself chamomile tea and running a warm bath tonight. Sometimes the best thing we can do is just be gentle with ourselves. Sending love to anyone else having a tough day 💕',
      likes: 0,
      comments: 0,
      tags: ['TTC Journey', 'Self Compassion', 'Real Talk'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'MK',
      name: 'Maya Kumar',
      badge: 'TTC Graduate',
      time: '1 day ago',
      content: 'I keep staring at this positive test in disbelief! After 14 months of hoping, charting, and so many disappointments, it finally happened 🌟 This community held me through the darkest moments when I wanted to give up. Your stories, your wisdom, your virtual hugs - they all mattered. To everyone still in the trenches: your time will come. I believe it with my whole heart ✨',
      image: 'https://images.unsplash.com/photo-1493217465235-252dd9c0d632',
      likes: 0,
      comments: 0,
      tags: ['BFP', 'Success Story', 'Community Love'],
      achievement: ''
    }
  ],

  'fertility-nutrition': [
    {
      id: '1',
      avatar: 'JW',
      name: 'Dr. Jennifer Walsh',
      badge: 'Fertility Nutritionist',
      time: '3 hours ago',
      content: 'Weekly nutrition tip: Omega-3s are CRUCIAL for egg quality! Try to include fatty fish 2-3x per week, or supplement with high-quality fish oil. My favorite combo: salmon with avocado and spinach - powerhouse meal for fertility! 🐟💪',
      likes: 142,
      comments: 31,
      tags: ['Expert Advice', 'Omega-3', 'Egg Quality'],
      achievement: 'Expert Contributor'
    },
    {
      id: '2',
      avatar: 'AL',
      name: 'Anna Liu',
      badge: 'TTC 6 months',
      time: '6 hours ago',
      content: 'Made the fertility smoothie bowl from last month\'s meal plan - WOW! 🤩 Berries, walnuts, Greek yogurt, and spinach. Even my husband loved it (he didn\'t know about the spinach 😉). Sharing the recipe in comments!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
      likes: 89,
      comments: 24,
      tags: ['Fertility Smoothie', 'Recipe Share', 'Antioxidants'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'RH',
      name: 'Rachel Hughes',
      badge: 'TTC 10 months',
      time: '1 day ago',
      content: 'PSA: Just learned that too much caffeine can affect implantation! 😱 Switching to herbal teas and feeling good about it. Red raspberry leaf tea is my new obsession. Anyone have other caffeine-free favorites?',
      likes: 56,
      comments: 19,
      tags: ['Caffeine', 'Herbal Tea', 'Implantation']
    }
  ],

  'mental-health': [
    {
      id: '1',
      avatar: 'LT',
      name: 'Dr. Lisa Thompson',
      badge: 'Perinatal Therapist',
      time: '1 hour ago',
      content: 'Gentle reminder: It\'s okay to not be okay. Postpartum anxiety affects 15-20% of new moms. You\'re not alone, you\'re not broken, and help is available. Our virtual support circle meets every Thursday 7PM EST - all welcome. 💝',
      likes: 203,
      comments: 45,
      tags: ['Mental Health', 'Postpartum Anxiety', 'Support'],
      achievement: 'Mental Health Advocate'
    },
    {
      id: '2',
      avatar: 'KM',
      name: 'Kelly Martinez',
      badge: '6 months postpartum',
      time: '4 hours ago',
      content: 'Bad mom guilt day today. Baby cried for 20 minutes and I just sat there crying too. Then I remembered what Dr. Lisa said - I\'m not failing, I\'m learning. Made myself tea, took deep breaths. We\'re both okay now. 🌈',
      likes: 127,
      comments: 38,
      tags: ['Mom Guilt', 'Self Compassion', 'Hard Days'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'NP',
      name: 'Nicole Porter',
      badge: '4 months postpartum',
      time: '8 hours ago',
      content: 'Update: Started therapy 3 weeks ago and it\'s helping SO much. If you\'re on the fence about getting help, this is your sign. My therapist specializes in perinatal mental health - happy to share her info via DM ❤️',
      likes: 94,
      comments: 17,
      tags: ['Therapy', 'Getting Help', 'Recovery']
    }
  ],

  'postpartum-support': [
    {
      id: '1',
      avatar: 'JS',
      name: 'Jessica Smith',
      badge: '3 months postpartum',
      time: '2 hours ago',
      content: 'Raw honesty time: I\'m sitting here at 3 AM after another challenging feeding session, feeling like I\'m failing at this whole breastfeeding thing 😢 Everyone made it sound so natural and beautiful, but nobody warned me about the pain, the exhaustion, or feeling like my body isn\'t my own. My little one finally latched properly for 5 minutes today and I literally cried tears of joy. To any mama struggling - you\'re not alone. We\'re all figuring this out together 💗',
      likes: 0,
      comments: 0,
      tags: ['Breastfeeding Struggles', 'Real Talk', 'Mama Support'],
      isNew: true
    },
    {
      id: '2',
      avatar: 'MB',
      name: 'Maria Bonilla',
      badge: '8 months postpartum',
      time: '5 hours ago',
      content: 'PSA for all the mamas: I managed to shower AND wash my hair today - practically felt like I won the lottery! 🎉 Some days my biggest accomplishment is keeping my little one fed and happy. Other days I tackle laundry, make dinner, and feel unstoppable. Both types of days are equally valid. Recovery isn\'t about bouncing back - it\'s about moving forward with grace and patience for yourself ✨',
      likes: 0,
      comments: 0,
      tags: ['Self Care Wins', 'Recovery Reality', 'Small Victories'],
      achievement: ''
    },
    {
      id: '3',
      avatar: 'TK',
      name: 'Tanya Kim',
      badge: '5 months postpartum',
      time: '1 day ago',
      content: 'Movement milestone! Did 20 minutes of gentle stretching while baby napped and my body actually felt... good? 😍 For months I wondered if I\'d ever feel strong again. My core is slowly remembering what it\'s supposed to do, my back pain is lessening, and I\'m sleeping better. To any mama wondering if you\'ll ever feel like yourself - you will, just in a new way. Progress isn\'t always visible, but it\'s happening 💪',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      likes: 0,
      comments: 0,
      tags: ['Postpartum Movement', 'Body Recovery', 'Self Discovery']
    }
  ],

  'working-moms': [
    {
      id: '1',
      avatar: 'AM',
      name: 'Amanda Miller',
      badge: 'Marketing Manager',
      time: '3 hours ago',
      content: 'Currently pumping in my car because the "lactation room" at work is literally a storage closet with a folding chair 😤 I\'m done settling for spaces that make us feel like we\'re asking for too much. Tomorrow I\'m having a conversation with leadership about creating an actual supportive environment for nursing moms. We shouldn\'t have to choose between our careers and feeding our babies properly. Who else is ready to advocate for the workplace changes we deserve? 💪',
      likes: 0,
      comments: 0,
      tags: ['Workplace Advocacy', 'Pumping Reality', 'Change Makers'],
      isNew: true
    },
    {
      id: '2',
      avatar: 'CL',
      name: 'Carmen Lopez',
      badge: 'Teacher & Mom',
      time: '6 hours ago',
      content: 'Sunday ritual complete! 🙌 Spent 4 hours prepping meals for the week while my little ones "helped" (aka taste-tested everything). My crockpot is my MVP - throw in ingredients before school, come home to the smell of dinner ready. It\'s not always Instagram-perfect, but it\'s real life and it works. Sharing my go-to recipes that have saved my sanity on countless crazy weekdays! 👨‍🍳',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      likes: 0,
      comments: 0,
      tags: ['Meal Prep Reality', 'Working Mom Life', 'Family Meals']
    },
    {
      id: '3',
      avatar: 'SK',
      name: 'Sarah Kim',
      badge: 'Software Engineer',
      time: '1 day ago',
      content: 'Victory moment! After months of feeling torn between work deadlines and daycare pickup times, I finally asked my manager about flexible hours. Turns out, she was a working mom too and totally understood! Starting next week: 7 AM - 3 PM so I can pick up my daughter without that daily sprint across town 🏃‍♀️ Sometimes the answer is yes, but you have to be brave enough to ask the question first ✨',
      likes: 0,
      comments: 0,
      tags: ['Work Life Balance', 'Flexible Hours', 'Mama Wins'],
      achievement: ''
    }
  ],

  'pregnancy-support': [
    {
      id: '1',
      avatar: 'EP',
      name: 'Emily Parker',
      badge: '32 weeks pregnant',
      time: '1 hour ago',
      content: 'Third trimester fatigue is REAL 😴 Can barely keep my eyes open at 3pm. Anyone else feel like they\'re running on empty? My midwife says it\'s normal but wow, I forgot how tired pregnancy makes you!',
      likes: 89,
      comments: 28,
      tags: ['Third Trimester', 'Pregnancy Fatigue', 'Normal Symptoms'],
      isNew: true
    },
    {
      id: '2',
      avatar: 'GR',
      name: 'Grace Rodriguez',
      badge: '28 weeks pregnant',
      time: '4 hours ago',
      content: 'Hospital bag packed! ✅ Started getting contractions last week (false alarm) but it was a wake-up call. Better to be prepared! Sharing my packing checklist - learned from my first pregnancy what I actually needed vs what I packed 😅',
      likes: 156,
      comments: 31,
      tags: ['Hospital Bag', 'Third Trimester Prep', 'Birth Prep']
    },
    {
      id: '3',
      avatar: 'MW',
      name: 'Dr. Michelle Wong',
      badge: 'OB-GYN',
      time: '6 hours ago',
      content: 'Weekly reminder: Trust your body! If something feels off, call your provider. You know your body better than anyone. There\'s no such thing as a "silly" concern when you\'re pregnant. We\'re here to support you! 💕',
      likes: 234,
      comments: 19,
      tags: ['Trust Your Body', 'Provider Advice', 'Pregnancy Support'],
      achievement: 'Medical Expert'
    }
  ],

  'nutrition-for-moms': [
    {
      id: '1',
      avatar: 'RD',
      name: 'Rachel Davis, RD',
      badge: 'Registered Dietitian',
      time: '2 hours ago',
      content: 'Mom hack: Smoothie packs! Prep all ingredients in freezer bags Sunday night - just dump, blend, and go on busy mornings. My go-to: spinach, banana, berries, protein powder, almond milk. Kids love them too! 🥤',
      likes: 298,
      comments: 67,
      tags: ['Meal Prep', 'Smoothies', 'Mom Hacks'],
      achievement: 'Nutrition Expert'
    },
    {
      id: '2',
      avatar: 'LW',
      name: 'Lauren Wright',
      badge: 'Mom of 3',
      time: '5 hours ago',
      content: 'Snack win! Made energy balls with the kids yesterday - oats, peanut butter, honey, chocolate chips. They had fun helping and I have healthy snacks for the week. Sometimes simple is best! Recipe in comments 👇',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35',
      likes: 187,
      comments: 43,
      tags: ['Healthy Snacks', 'Kids Activities', 'Energy Balls'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'JG',
      name: 'Jennifer Green',
      badge: 'Busy Mom',
      time: '1 day ago',
      content: 'Reality check: Fed is best, stressed is not! Had takeout twice this week and you know what? My family is fed, happy, and healthy. Some weeks we meal prep, some weeks we survive. Both are okay! 💪',
      likes: 445,
      comments: 89,
      tags: ['Mom Guilt', 'Real Life', 'Self Compassion']
    }
  ]
};

export const moderationPrompts = [
  "💝 Friendly reminder: Share your experiences, not medical advice. When in doubt, consult your healthcare provider!",
  "🌟 This is a judgment-free zone! Let's support each other with kindness and understanding.",
  "💬 Great discussion happening! Remember to stay respectful and supportive of different perspectives.",
  "🤝 New to the group? Welcome! Don't be shy - introduce yourself and share what brings you here.",
  "📝 Having a tough day? This community is here for you. Share what you need - we're listening!",
  "✨ Success stories welcome! Your wins inspire others - don't be afraid to celebrate your progress."
];

export const activityMessages = {
  'ttc-journey-support': [
    '🌟 Emma just started her mindful morning routine journey',
    '💕 Sofia shared her authentic emotions about CD1 - so brave!',
    '✨ Maya\'s BFP announcement brought tears of joy to our community',
    '🧘‍♀️ 12 members joined today\'s fertility meditation circle',
    '🌸 New member just joined our TTC support family',
    '💫 Weekly hope and healing circle starting soon'
  ],
  'mental-health': [
    '🌈 Someone took their first brave step toward therapy today',
    '💪 Virtual support session happening now - all welcome',
    '✨ Beautiful breakthrough shared in our safe space',
    '❤️ Mindfulness check-in bringing mamas together',
    '🤝 Peer support circle creating real connections',
    '🌟 Mental health resources helping families thrive'
  ],
  'postpartum-support': [
    '🎉 Jessica celebrated a successful breastfeeding session!',
    '💪 Maria honored her body\'s healing journey today',
    '🌟 Tanya shared her gentle movement progress',
    '❤️ Breastfeeding support thread offering real help',
    '🤱 Lactation support meeting tomorrow - join us!',
    '⭐ New postpartum mamas finding their village here'
  ],
  'working-moms': [
    '🎉 Amanda is advocating for better workplace conditions!',
    '💪 Carmen\'s meal prep wisdom helping busy families',
    '🌟 Sarah secured flexible hours - showing it\'s possible!',
    '❤️ Working mama support thread building community',
    '🔥 Work-life balance strategies being shared now',
    '⭐ Professional moms lifting each other up daily'
  ],
  'pregnancy-support': [
    '🎉 Third trimester mama completed birth prep today!',
    '💪 Pregnancy wellness tips being shared with love',
    '🌟 Hospital bag wisdom from experienced mamas',
    '❤️ Movement session bringing expecting moms together',
    '🔥 Birth preparation class starts this weekend',
    '⭐ Pregnant mamas finding community and support here'
  ],
  'nutrition-for-moms': [
    '🎉 Healthy family meal ideas shared with love!',
    '💪 Real nutrition tips for busy mama life',
    '🌟 "Fed is best" wisdom resonating with families',
    '❤️ Meal planning session helping real families',
    '🔥 Family nutrition workshop starting soon',
    '⭐ Nutrition support helping mamas thrive daily'
  ]
};