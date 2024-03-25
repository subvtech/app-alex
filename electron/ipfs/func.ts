import { create } from "kubo-rpc-client";
import type { IPFSHTTPClient } from "kubo-rpc-client";
import { Cluster } from "@nftstorage/ipfs-cluster";

function createClient(): IPFSHTTPClient {
  let client = create({
    host: "127.0.0.1",
    port: 5001,
  });
  return client;
}

function createCluster(): Cluster {
  let cluster = new Cluster("http://127.0.0.1:9094");
  return cluster;
}

let client = createClient();
let cluster = createCluster();

const uploadFile = async (file: File) => {
  try {
    const name = file.name;
    const buff = await file.arrayBuffer();
    await client.files.write(`/${name}`, new TextDecoder().decode(buff), { create: true });

    let info = [];
    for await (const data of client.files.ls(`/${name}`)) {
      info.push(data);
    }
    console.log("kubo: ", info[0].cid.toString());

    const { cid } = await cluster.add(file);
    await cluster.pin(cid)
    console.log("cluster: ", cid);
  } catch (e) {
    console.log(e);
  }
};

export { uploadFile };
