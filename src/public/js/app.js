import "regenerator-runtime/runtime"; //webpack 사용후 regen..runtime error 해결용

const socket = io(); //백엔드와 소켓 연결

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0]; //현재 사용중인 device
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) {
        option.selected = true;
      }
      camerasSelect.append(option);
    });
  } catch (error) {
    console.log(error);
  }
};

const getMedia = async (deviceId) => {
  //deviceId = null
  const initalConstraints = {
    audio: true,
    video: { facingMode: "user" }, //전면카메라
  };
  //deviceId=~~
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initalConstraints
    );
    myFace.srcObject = myStream;
    //deviceId가 없을때만 getCamera paint..안그러면 장치 바꿀때마다 페인트됨
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
};

// getMedia();

const handleMuteBtn = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled)); //audio track에 대해 enabled값을 현재와 반대로 설정
  if (!muted) {
    //소리가 나온다면 mute하고 "unmute"로
    muted = true;
    muteBtn.innerText = "Unmute";
  } else {
    muted = false;
    muteBtn.innerText = "Mute";
  }
};

const handleCameraBtn = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled)); //video track에 대해 enabled 값을 현재와 반대로
  if (cameraOff) {
    //Off돼있을 때 btn 누르면 on
    cameraOff = false;
    cameraBtn.innerText = "Camera Off";
  } else {
    cameraOff = true;
    cameraBtn.innerText = "Camera On";
  }
};

const handleCameraChange = async (event) => {
  await getMedia(camerasSelect.value); //camera device id
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
};

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
camerasSelect.addEventListener("input", handleCameraChange);

//방 입장시
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

const handleWelcomeSubmit = async (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall(); //initCall하는 속도가 상대적으로 느려 소켓 안에 두면 offer속도를 못따라감
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//socket code
////peerA
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer(); //다른 브라우저가 연결되도록 offer(일종의 초대장)
  //offer를 peerB로
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});
////peerB
socket.on("offer", async (offer) => {
  console.log("received the offer");
  // console.log(offer); //peerA로부터 받은 offer를 출력
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  // console.log(answer);
  //answer를 peerA로
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});
////PeerA
socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received ICE candidate");
  myPeerConnection.addIceCandidate(ice);
});

//RTC code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener("icecandidate", handleIce); //offer-answer과정 다음
  myPeerConnection.addEventListener("addstream", handleAddStream);
  // console.log(myStream.getTracks()); //video track과 audio track
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  // console.log(data);
  console.log("sent ICE candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  console.log("got an stream from my peer");
  console.log("Peer's stream", data.stream);
  console.log("My stream", myStream);
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}
