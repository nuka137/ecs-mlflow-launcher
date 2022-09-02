import {ClusterList} from "./ClusterList";
import { useState } from "react";
import {Cluster} from "../types/Cluster";

function App() {
  const [clusterList, setClusterList] = useState<Cluster[]>([]);

  return (
    <>
      <ClusterList clusterList={clusterList} setClusterList={setClusterList} />
    </>
  )
}

export default App;
