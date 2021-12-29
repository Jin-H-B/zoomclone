const socket = io(); //백엔드와 소켓 연결

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

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

getMedia();

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
};

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
camerasSelect.addEventListener("input", handleCameraChange);
