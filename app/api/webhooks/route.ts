// Webhook response received from The Next Leg
// {
//   "createdAt": {
//       "_nanoseconds": 215000000,
//       "_seconds": 1678840347
//   },
//   "buttons": [
//       "U1",
//       "U2",
//       "U3",
//       "U4",
//       "🔄",
//       "V1",
//       "V2",
//       "V3",
//       "V4"
//   ],
//   "imageUrl": "your-image-url",
//   "buttonMessageId": "OtfxNzfMIKBPVE1aP4u4",
//   "originatingMessageId": "your-message-id",
//   "content": "your-original-prompt"
// }

// {
//   "progress": 100,
//   "response": {
//       "createdAt": "2023-07-08T18:59:14.302Z",
//       "originatingMessageId": "5Vf2LVahPh5w8m7KqVzs",
//       "ref": "",
//       "buttons": [
//           "U1",
//           "U2",
//           "U3",
//           "U4",
//           ":arrows_counterclockwise:",
//           "V1",
//           "V2",
//           "V3",
//           "V4"
//       ],
//       "imageUrl": "https://cdn.discordapp.com/attachments/1125506214197997629/1127312960436568084/Alikos87_a_anime_cute_very_skinny_dragon_220c94fc-9967-4c12-834e-33ef6702ae4b.png",
//       "imageUrls": [
//           "https://cdn.midjourney.com/220c94fc-9967-4c12-834e-33ef6702ae4b/0_0.png",
//           "https://cdn.midjourney.com/220c94fc-9967-4c12-834e-33ef6702ae4b/0_1.png",
//           "https://cdn.midjourney.com/220c94fc-9967-4c12-834e-33ef6702ae4b/0_2.png",
//           "https://cdn.midjourney.com/220c94fc-9967-4c12-834e-33ef6702ae4b/0_3.png"
//       ],
//       "responseAt": "2023-07-08T18:59:14.601Z",
//       "description": "",
//       "type": "imagine",
//       "content": "a anime cute very skinny dragon --q 3 --s 300",
//       "buttonMessageId": "lcSpsjfa08a8NHHxCXMz"
//   }
// }

// {
//   "content": "male red color of an animated hero in a bright outfit, in the style of furaffinity, cosmic, manga-inspired, dark azure and gold, [tyler edlin], superheroes, [shuzo oshimi]",
//   "imageUrl": "https://cdn.discordapp.com/attachments/1125506214197997629/1143225493148155964/Alikos87_male_red_color_of_an_animated_hero_in_a_bright_outfit__756c4789-639b-47c6-9f09-4d47ae5b9ca0.png",
//   "imageUrls": [
//     "https://cdn.midjourney.com/756c4789-639b-47c6-9f09-4d47ae5b9ca0/0_0.png",
//     "https://cdn.midjourney.com/756c4789-639b-47c6-9f09-4d47ae5b9ca0/0_1.png",
//     "https://cdn.midjourney.com/756c4789-639b-47c6-9f09-4d47ae5b9ca0/0_2.png",
//     "https://cdn.midjourney.com/756c4789-639b-47c6-9f09-4d47ae5b9ca0/0_3.png"
//   ],
//   "buttons": [
//     "U1",
//     "U2",
//     "U3",
//     "U4",
//     "🔄",
//     "V1",
//     "V2",
//     "V3",
//     "V4"
//   ],
//   "createdAt": "2023-08-21T16:49:57.804Z",
//   "responseAt": "2023-08-21T16:49:58.105Z",
//   "ref": "",
//   "description": "",
//   "accountId": "USX9YqS2eofuJeq44JmV",
//   "type": "imagine",
//   "originatingMessageId": "3czRw8DtU3rXFz7MLEGv",
//   "buttonMessageId": "HPSkKO22KRXungrlYWE3"
// }

import { PUSHER_APPID, PUSHER_CLUSTER, PUSHER_KEY, PUSHER_SECRET, PUSHER_CHANNEL } from "@/config/constant";
import Pusher from "pusher";

export async function POST(req: Request) {
  const body = await req.json()
  const pusher = new Pusher({
    appId: PUSHER_APPID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true
  });

  await pusher.trigger(PUSHER_CHANNEL, body.originatingMessageId, body);

  return new Response(JSON.stringify({ received: true }));
}
