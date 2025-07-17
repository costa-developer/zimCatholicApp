// app/(tabs)/data/readingsData.ts

export type ReadingSection = {
  title: string;
  content: string;
};

export type DailyReadings = {
  firstReading: ReadingSection;
  responsorialPsalm: ReadingSection;
  secondReading?: ReadingSection;  // optional
  gospel: ReadingSection;
};

export type ReadingsByDate = Record<string, DailyReadings>;

export const readingsData: ReadingsByDate = {
  '2025-07-08': {
    firstReading: {
      title: 'First Reading — Genesis 18:1-10a',
      content:
        `The Lord appeared to Abraham by the oaks of Mamre, as he sat at the entrance of his tent in the heat of the day. He looked up and saw three men standing near him. When he saw them, he ran from the tent entrance to meet them, and bowed down to the ground. He said, "My lord, if I find favor with you, do not pass by your servant. Let a little water be brought, and wash your feet, and rest yourselves under the tree. Let me bring a little bread, that you may refresh yourselves, and after that you may pass on—since you have come to your servant." So they said, "Do as you have said." Abraham hastened into the tent to Sarah, and said, "Make ready quickly three measures of choice flour, knead it, and make cakes."...`
    },
    responsorialPsalm: {
      title: 'Responsorial Psalm — Psalm 15:2-3a, 3bc-4ab, 5',
      content:
        `Lord, who may dwell in your tabernacle? Who may abide upon your holy hill? Whoever leads a blameless life and does what is right, who speaks the truth from the heart. They do not slander with the tongue, they do no evil to their friends; they do not cast discredit upon a neighbor. They despise a vile person but honor those who fear the Lord. They swear to their own hurt and do not change. They do not put out their money at interest and do not take a bribe against the innocent. Whoever does these things shall never be disturbed.`
    },
    secondReading: {
      title: 'Second Reading — Colossians 1:24-28',
      content:
        `Now I rejoice in my sufferings for your sake, and in my flesh I am filling up what is lacking in Christ's afflictions for the sake of his body, that is, the church. I became its minister according to God's commission that was given to me for you, to make the word of God fully known, the mystery hidden for ages and generations but now revealed to his saints. To them God chose to make known how great among the Gentiles are the riches of the glory of this mystery, which is Christ in you, the hope of glory. Him we proclaim, warning everyone and teaching everyone with all wisdom, that we may present everyone mature in Christ.`
    },
    gospel: {
      title: 'Gospel — Luke 10:38-42',
      content:
        `Now as they went on their way, Jesus entered a village; and a woman named Martha welcomed him into her home. She had a sister named Mary, who sat at the Lord's feet and listened to what he was saying. But Martha was distracted by her many tasks; so she came to him and asked, "Lord, do you not care that my sister has left me to do all the work by myself? Tell her then to help me." But the Lord answered her, "Martha, Martha, you are worried and distracted by many things; there is need of only one thing. Mary has chosen the better part, which will not be taken away from her."`
    }
  },

  '2025-07-09': {
    firstReading: {
      title: 'First Reading — Genesis 18:20-32',
      content:
        `The Lord said, "How great is the outcry against Sodom and Gomorrah and how very grave their sin! I must go down and see whether they have done altogether according to the outcry that has come to me; if not, I will know." Abraham drew near and said, "Will you indeed sweep away the righteous with the wicked? Suppose there are fifty righteous within the city; will you then sweep away the place and not spare it for the fifty righteous who are in it?" The Lord said, "If I find at Sodom fifty righteous in the city, I will spare the whole place because of them." Abraham answered, "Let me take it upon myself to speak to the Lord, I who am but dust and ashes. Suppose the fifty righteous are five less, will you destroy the whole city for lack of five?" The Lord said, "I will not destroy it if I find forty-five there." Then Abraham said, "Suppose forty are found there?" The Lord said, "For the sake of forty I will not do it." Abraham said, "Let not the Lord be angry, and I will speak: suppose thirty are found there?" He said, "I will not do it if I find thirty there." Abraham said, "Suppose twenty are found there?" He said, "For the sake of twenty I will not destroy it." Abraham said, "Let not the Lord be angry, and I will speak but this once: suppose ten are found there?" He said, "For the sake of ten I will not destroy it."`
    },
    responsorialPsalm: {
      title: 'Responsorial Psalm — Psalm 138:1-2, 2-3, 6-7c, 7e-8',
      content:
        `I give you thanks, O Lord, with my whole heart; before the gods I sing your praise; I bow down toward your holy temple and give thanks to your name for your steadfast love and your faithfulness; for you have exalted above all things your name and your word. On the day I called, you answered me, you increased my strength of soul. Though the Lord is high, he regards the lowly, but the haughty he perceives from far away. Though I walk in the midst of trouble, you preserve my life; you stretch out your hand against the wrath of my enemies, and your right hand delivers me.`
    },
    gospel: {
      title: 'Gospel — Matthew 8:18-22',
      content:
        `Now when Jesus saw a crowd around him, he gave orders to go to the other side. A scribe came up and said to him, "Teacher, I will follow you wherever you go." And Jesus said to him, "Foxes have holes, and birds of the air have nests; but the Son of Man has nowhere to lay his head." Another of the disciples said to him, "Lord, let me first go and bury my father." But Jesus said to him, "Follow me, and let the dead bury their dead."`
    }
  },

  '2025-07-10': {
    firstReading: {
      title: 'First Reading — Genesis 19:15-29',
      content:
        `When morning dawned, the angels urged Lot, saying, "Get up, take your wife and your two daughters who are here, or you will be swept away in the punishment of the city." But he hesitated, and the angels seized his hand and the hands of his wife and of his two daughters, the Lord being merciful to him. They brought him out and set him outside the city. As they were fleeing, Lot said, "Oh no, my lords! Behold, your servant has found favor in your sight, and you have shown me great kindness in saving my life; but I cannot escape to the mountains, lest some evil take me and I die. Behold, this town is near enough to flee to, and it is a little one; let me escape there—is it not a little one?—and my life shall be saved!" He said to them, "Behold, I grant you this favor also, that not one of the towns you seek shall be destroyed."`
    },
    responsorialPsalm: {
      title: 'Responsorial Psalm — Psalm 26:2-3, 9-10, 11-12',
      content:
        `Judge me, O Lord, for I have walked in my integrity; I have trusted in the Lord without wavering. Test me, O Lord, and try me; examine my heart and my mind. Do not let those who hope in you be put to shame through me, O Lord, God of hosts. My steps have held fast to your paths; my feet have not slipped.`
    },
    gospel: {
      title: 'Gospel — Matthew 8:23-27',
      content:
        `When he got into the boat, his disciples followed him. Suddenly a violent storm came up on the sea, so that the boat was being swamped by the waves; but he was asleep. And they went and woke him up, saying, "Lord, save us! We are perishing!" And he said to them, "Why are you afraid, O you of little faith?" Then he rose and rebuked the winds and the sea; and there was a great calm.`
    }
  },

  '2025-07-11': {
    firstReading: {
      title: 'First Reading — Isaiah 1:1, 10-17',
      content:
        `The vision of Isaiah son of Amoz, which he saw concerning Judah and Jerusalem in the days of Uzziah, Jotham, Ahaz, and Hezekiah, kings of Judah. Hear the word of the Lord, you rulers of Sodom! Listen to the teaching of our God, you people of Gomorrah! "Wash yourselves; make yourselves clean; remove the evil of your doings from before my eyes; cease to do evil, learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow's cause."`
    },
    responsorialPsalm: {
      title: 'Responsorial Psalm — Psalm 50:8-9, 16bc-17, 21, 23',
      content:
        `Do you think I eat the flesh of bulls, or drink the blood of goats? Offer to God a sacrifice of thanksgiving, and perform your vows to the Most High; call upon me in the day of trouble; I will deliver you, and you shall glorify me. Those who forget God are like the beasts that perish. Whoever offers me thanksgiving glorifies me; to him who orders his way rightly I will show the salvation of God.`
    },
    gospel: {
      title: 'Gospel — Matthew 10:34—11:1',
      content:
        `Jesus said to his disciples: "Do not think that I have come to bring peace to the earth. I have not come to bring peace, but a sword. For I have come to set a man against his father, and a daughter against her mother, and a daughter-in-law against her mother-in-law; and a person's enemies will be those of his own household. Whoever loves father or mother more than me is not worthy of me, and whoever loves son or daughter more than me is not worthy of me. And whoever does not take up his cross and follow me is not worthy of me. Whoever finds his life will lose it, and whoever loses his life for my sake will find it.`
    }
  },

  // Add more dates up to 31 July here similarly...
};
