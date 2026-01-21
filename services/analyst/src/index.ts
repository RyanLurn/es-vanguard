const filePath = "json-worker.js";

if (/-[a-zA-Z0-9]{8,20}\.js$/.test(filePath)) {
  console.log("true");
} else {
  console.log("false");
}
