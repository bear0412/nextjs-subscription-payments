const Pusher = require("pusher-js");

const pusher = new Pusher('18e7661daefa46639f78', {
  cluster: 'eu'
});

const channel = pusher.subscribe('eden-ai');

channel.bind('generatedAvatar', function (data) {
  console.log(data)
});
channel.bind('3voQrCFzNsJUInhrQB76', function (data) {
  console.log(data)
});

