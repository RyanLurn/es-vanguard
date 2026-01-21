const file = new File(["Hello world"], "hello.txt", { type: "text/plain" });

console.log(Bun.hash.xxHash3(await file.arrayBuffer()));
