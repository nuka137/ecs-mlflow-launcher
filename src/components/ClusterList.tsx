import {Cluster} from "../types/Cluster";
import * as api from "../apis/cluster";
import React, { Dispatch } from "react";

export const ClusterList = ({
    clusterList,
    setClusterList,
}: {
    clusterList: Cluster[];
    setClusterList : Dispatch<Cluster[]>;
}) => {
    const handleClusterListButton = () => {
        api.getAllClusters().then((data) => {
            console.log(data);
            let instances = data["instanceIds"];
            let clusterList = [];
            for (let i = 0; i < instances.length; ++i) {
                clusterList.push({
                    id: instances[i]
                });
            }
            setClusterList(clusterList);
        });
    };

    const handleClusterPowerButton = (event: React.MouseEvent<HTMLElement>) => {
        let clusterId = event.currentTarget.getAttribute('data-cluster-id');
        if (clusterId !== null) {
            api.startCluster(clusterId).then((data) => {
                console.log(data);
            });
        }
    };

    return (
        <>
            <button onClick={handleClusterListButton}>List Clusters</button>
            <ul className="cluster">
                {clusterList.map((cluster) => (
                    <li className="cluster-item">
                        <div className="cluster-item__name">
                            {cluster.id}
                        </div>
                        <div className="cluster-item__button">
                            <button onClick={handleClusterPowerButton} data-cluster-id={cluster.id}></button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};
