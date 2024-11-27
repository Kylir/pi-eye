var app = new Vue({
  el: "#app",
  data: {
    picName: "image",
    videoName: "video",
    videoDuration: "30",
    timelapseName: "timelapse",
    timelapseDuration: "60",
    timelapseInterval: "5",
    isStreamStarted: false,
    responses: [],
  },
  methods: {
    takePicture: function () {
      let vm = this;
      let uri = `/pic/${vm.picName}`;
      fetch(uri)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (json) {
          if (json.status) {
            if (json.status === "error") {
              vm.responses.push({
                class: "error",
                text: `Error: "${JSON.stringify(json.err)}"`,
              });
            } else if (json.status === "ok") {
              vm.responses.push({
                class: "success",
                text: "Image generated",
                url: json.path,
              });
            }
          } else {
            vm.responses.push({
              class: "unknown",
              text: `Unknown response received: "${JSON.stringify(json)}"`,
            });
          }
        });
    },

    createVideo: function () {
      let vm = this;
      let uri = `/video/${this.videoName}/${this.videoDuration}`;
      fetch(uri)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (json) {
          if (json.status && json.status === "pending") {
            vm.responses.push({
              class: "success",
              text: "Video will be generated shortly",
              url: json.path,
            });
          } else {
            vm.responses.push({
              class: "unknown",
              text: `Unknown response received: "${JSON.stringify(json)}"`,
            });
          }
        });
    },

    createTimelapse: function () {
      let vm = this;
      let uri = `/timelapse/${this.timelapseName}/${this.timelapseDuration}/${this.timelapseInterval}`;
      fetch(uri)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (json) {
          if (json.status && json.status === "pending") {
            vm.responses.push({
              class: "success",
              text: "Timelapse will be generated shortly",
              url: json.path,
            });
          } else {
            vm.responses.push({
              class: "unknown",
              text: `Unknown response received: "${JSON.stringify(json)}"`,
            });
          }
        });
    },

    startStream: function () {
      let vm = this;
      let uri = "/stream/start";
      vm.isStreamStarted = true;
      fetch(uri)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (json) {
          if (json.status && json.status === "pending") {
            vm.responses.push({
              class: "success",
              text: "Stream should be started.",
            });
          } else {
            vm.responses.push({
              class: "unknown",
              text: `Unknown response received: "${JSON.stringify(json)}"`,
            });
            // an error occured - revert the state of the button
            vm.isStreamStarted = false;
          }
        });
    },

    stopStream: function () {
      let vm = this;
      let uri = "/stream/stop";
      vm.isStreamStarted = false;
      fetch(uri)
        .then(function (resp) {
          return resp.json();
        })
        .then(function (json) {
          if (json.status && json.status === "pending") {
            vm.responses.push({
              class: "success",
              text: "Stream should be stopped",
            });
          } else {
            vm.responses.push({
              class: "unknown",
              text: `Unknown response received: "${JSON.stringify(json)}"`,
            });
          }
        });
    },
  },
});
