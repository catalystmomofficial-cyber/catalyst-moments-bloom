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
      content: 'Just got back from my fertility specialist appointment and feeling hopeful! She said my blood work looks great and recommended some lifestyle tweaks. Taking this one day at a time. Anyone else have good experiences with their fertility team?',
      likes: 34,
      comments: 18,
      tags: ['TTC Support', 'Fertility Specialist', 'Hope'],
      achievement: 'Community Helper'
    },
    {
      id: '2',
      avatar: 'SL',
      name: 'Sofia Lopez',
      badge: 'TTC 4 months',
      time: '5 hours ago',
      content: 'Update: CD1 again today 😔 But trying to stay positive! Started the meditation series recommended here and it\'s helping with the emotional ups and downs. This community keeps me sane honestly. Love you all ❤️',
      likes: 67,
      comments: 23,
      tags: ['TTC Journey', 'Self Care', 'Community Love'],
      isNew: true
    },
    {
      id: '3',
      avatar: 'MK',
      name: 'Maya Kumar',
      badge: 'TTC Graduate',
      time: '1 day ago',
      content: 'Wanted to share some hope with this beautiful community! After 14 months TTC, I got my BFP last week! 💕 Thank you all for the support - the cycle tracking tips and nutrition advice from here made such a difference. Baby dust to everyone! ✨',
      image: 'https://images.unsplash.com/photo-1493217465235-252dd9c0d632',
      likes: 189,
      comments: 47,
      tags: ['BFP', 'Success Story', 'Gratitude'],
      achievement: 'Success Story'
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
      content: 'Can we talk about how HARD breastfeeding is?? 😭 Everyone said it would be "natural" but we\'re still figuring it out. Seeing a lactation consultant tomorrow. Anyone else struggle with this? Need some mama solidarity right now.',
      likes: 156,
      comments: 42,
      tags: ['Breastfeeding', 'Lactation Support', 'Real Talk'],
      isNew: true
    },
    {
      id: '2',
      avatar: 'MB',
      name: 'Maria Bonilla',
      badge: '8 months postpartum',
      time: '5 hours ago',
      content: 'Postpartum recovery is NOT linear! Some days I feel like superwoman, others I can barely shower. Today was a shower day and I\'m celebrating! 🎉 Remember: healing takes time and that\'s perfectly normal.',
      likes: 234,
      comments: 58,
      tags: ['Recovery', 'Healing Journey', 'Self Care'],
      achievement: 'Recovery Warrior'
    },
    {
      id: '3',
      avatar: 'TK',
      name: 'Tanya Kim',
      badge: '5 months postpartum',
      time: '1 day ago',
      content: 'Finally did my first "real" workout yesterday - 20 minutes of gentle movement and stretching. My core is slowly coming back! Taking it one day at a time. Shoutout to the amazing physio resources in this community! 💪',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      likes: 89,
      comments: 23,
      tags: ['Postpartum Fitness', 'Core Recovery', 'Progress']
    }
  ],

  'working-moms': [
    {
      id: '1',
      avatar: 'AM',
      name: 'Amanda Miller',
      badge: 'Marketing Manager',
      time: '3 hours ago',
      content: 'Pumping in the supply closet because the "lactation room" is actually just a bathroom with a chair 🙄 Anyone else dealing with less-than-ideal work conditions? We deserve better! Planning to talk to HR this week.',
      likes: 178,
      comments: 67,
      tags: ['Pumping at Work', 'Workplace Rights', 'Advocacy'],
      isNew: true
    },
    {
      id: '2',
      avatar: 'CL',
      name: 'Carmen Lopez',
      badge: 'Teacher & Mom',
      time: '6 hours ago',
      content: 'Sunday meal prep DONE! ✅ 4 hours of cooking but we\'re set for the week. Crockpot meals are my lifesaver - throw everything in before work, come home to dinner ready. Sharing my favorite recipes below! 👇',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
      likes: 145,
      comments: 34,
      tags: ['Meal Prep', 'Time Management', 'Working Mom Hacks']
    },
    {
      id: '3',
      avatar: 'SK',
      name: 'Sarah Kim',
      badge: 'Software Engineer',
      time: '1 day ago',
      content: 'Negotiated flexible hours with my manager today! 🎉 Will be working 7-3 instead of 9-5 so I can pick up my daughter from daycare. Sometimes you just have to ask. Don\'t be afraid to advocate for what you need!',
      likes: 267,
      comments: 45,
      tags: ['Work Flexibility', 'Advocacy', 'Mom Wins'],
      achievement: 'Work-Life Balance Champion'
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
    '🎉 Maya just shared her BFP story - spreading hope!',
    '💕 Emma completed her first fertility yoga session',
    '🌟 New member Sofia joined our TTC support circle',
    '❤️ 23 members loved Rachel\'s meditation tip',
    '🔥 Weekly Q&A with fertility specialist starts in 1 hour!',
    '⭐ 5 members earned their "Hope Keeper" badge today'
  ],
  'mental-health': [
    '🌈 Kelly shared her breakthrough moment - so brave!',
    '💪 Dr. Lisa is hosting a live support session tonight',
    '✨ Nicole connected with a local therapist through our resources',
    '❤️ 34 members joined today\'s mindfulness check-in',
    '🤝 Virtual support circle starting in 30 minutes',
    '🌟 Sarah earned her "Wellness Warrior" badge'
  ],
  'postpartum-support': [
    '🎉 Jessica celebrated her first full night of sleep!',
    '💪 Maria completed her 4th week of gentle movement',
    '🌟 Tanya shared her core recovery progress photos',
    '❤️ 45 members loved today\'s breastfeeding support thread',
    '🔥 Lactation consultant Q&A session tomorrow at 2 PM',
    '⭐ 8 new moms joined our recovery support group'
  ],
  'working-moms': [
    '🎉 Amanda successfully advocated for a proper lactation room!',
    '💪 Carmen shared her weekly meal prep masterclass',
    '🌟 Sarah negotiated flexible work hours - inspiring!',
    '❤️ 67 members loved today\'s childcare resource thread',
    '🔥 Work-life balance workshop starts in 2 hours',
    '⭐ Michelle earned her "Advocacy Champion" badge'
  ],
  'pregnancy-support': [
    '🎉 Grace completed her hospital bag checklist!',
    '💪 Emily started her third trimester birth prep class',
    '🌟 Dr. Wong shared weekly pregnancy wellness tips',
    '❤️ 28 members joined today\'s movement and stretch session',
    '🔥 Birth preparation workshop this Saturday at 10 AM',
    '⭐ 12 expecting moms joined our birth support group'
  ],
  'nutrition-for-moms': [
    '🎉 Rachel shared her famous smoothie pack recipe!',
    '💪 Lauren\'s energy ball tutorial was a huge hit',
    '🌟 Jennifer\'s "fed is best" post resonated with 445 moms',
    '❤️ 67 members loved today\'s meal planning session',
    '🔥 Family nutrition workshop starts in 1 hour',
    '⭐ Amy earned her "Nutrition Champion" badge'
  ]
};