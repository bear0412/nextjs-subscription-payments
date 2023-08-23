const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1641544",
  key: "18e7661daefa46639f78",
  secret: "acf3548068f6d3758b66",
  cluster: "eu",
  useTLS: true
});

pusher.trigger('eden-ai', 'iewLudIIYWDb9GPX7nfx', {
  "message": "hello world"
});

pusher.trigger('eden-ai', 'kaNnCdkDHGvcr80kbKQF', {
  content: 'male red color of an animated hero in a bright outfit, in the style of furaffinity, cosmic, manga-inspired, dark azure and gold, [tyler edlin], superheroes, [shuzo oshimi]',
  imageUrl: 'https://cdn.discordapp.com/attachments/1125506214197997629/1143428790068977774/Alikos87_male_red_color_of_an_animated_hero_in_a_bright_outfit__930baf9a-d0df-4c30-818d-26037dbf20bb.png',
  imageUrls: [
    'https://cdn.midjourney.com/930baf9a-d0df-4c30-818d-26037dbf20bb/0_0.png',
    'https://cdn.midjourney.com/930baf9a-d0df-4c30-818d-26037dbf20bb/0_1.png',
    'https://cdn.midjourney.com/930baf9a-d0df-4c30-818d-26037dbf20bb/0_2.png',
    'https://cdn.midjourney.com/930baf9a-d0df-4c30-818d-26037dbf20bb/0_3.png'
  ],
  buttons: [
    'U1', 'U2', 'U3',
    'U4', '🔄', 'V1',
    'V2', 'V3', 'V4'
  ],
  createdAt: '2023-08-22T06:17:47.546Z',
  responseAt: '2023-08-22T06:17:47.795Z',
  ref: '',
  description: '',
  accountId: 'USX9YqS2eofuJeq44JmV',
  type: 'imagine',
  originatingMessageId: 't3IhWNvOepjEokss4fHd',
  buttonMessageId: 'FEHpogoRa4ae7fAl8ATv'
});