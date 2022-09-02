import {Cluster} from "../types/Cluster";
import * as api from "../apis/cluster";
import { Dispatch } from "react";

export const ClusterList = ({
    clusterList,
    setClusterList,
}: {
    clusterList: Cluster[];
    setClusterList : Dispatch<Cluster[]>;
}) => {
    const handleClusterListButton = () => {
        api.getAllClusters().then((data) => {
            setClusterList([{id: "HOGE"}]);
        });
    };

    return (
        <>
            <button onClick={handleClusterListButton}>List Clusters</button>
            <ul>
                {clusterList.map((cluster) => (
                    <li>
                        {cluster.id}
                    </li>
                ))}
            </ul>
        </>
    );
};