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

import { PUSHER_APPID, PUSHER_CLUSTER, PUSHER_KEY, PUSHER_SECRET, PUSHER_CHANNEL, PUSHER_EVENT } from "@/config/constant";
import Pusher from "pusher";

export async function POST(req: Request) {
  const body = await req.json()
  const pusher = new Pusher({
    appId: PUSHER_APPID || "",
    key: PUSHER_KEY || "",
    secret: PUSHER_SECRET || "",
    cluster: PUSHER_CLUSTER || "",
    useTLS: true
  });

  await pusher.trigger(PUSHER_CHANNEL || "", PUSHER_EVENT || "", body);
  // console.log("called api/webhooks", req.body)
  // const { imageUrls, content, originatingMessageId } = req.body as any;
  // const NextlegReqConfig = {
  //   method: "get",
  //   url: `https://api.thenextleg.io/v2/message/${originatingMessageId || "GoNKsRq5Qp2mfqoPynTk"}`,
  //   headers: {
  //     'Authorization': `Bearer ${NEXTLEG_TOKEN}`,
  //     'Content-Type': 'application/json'
  //   },
  // }
  // const response = await axios<any, NextlegRes>(NextlegReqConfig)
  // console.log("-----------------------", response.response);
  // setGeneratedAvatar({
  //   imageUrls,
  //   content,
  //   originatingMessageId
  // });
  // setGeneratedAvatar({ ...response.response });

  return new Response(JSON.stringify({ received: true }));
}
