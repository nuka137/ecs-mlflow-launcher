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
            let instances = data["instanceIds"];
            let clusterList = [];
            for (let i = 0; i < instances.length; ++i) {
                clusterList.push({
                    id: instances[i]["InstanceId"],
                    state: instances[i]["State"]
                });
            }
            setClusterList(clusterList);
        });
    };

    const handleClusterPowerButton = (event: React.MouseEvent<HTMLElement>) => {
        let clusterId = event.currentTarget.getAttribute('data-cluster-id');
        if (clusterId !== null) {
            for (let i = 0; i < clusterList.length; ++i) {
                if (clusterList[i].id != clusterId) {
                    continue;
                }
                if (clusterList[i].state === "stopped") {
                    api.startCluster(clusterId).then((data) => {
                        console.log(data);
                    });
                } else {
                    api.stopCluster(clusterId).then((data) => {
                        console.log(data);
                    });
                }
            }
        }
    };

    type Props = {
        cluster: Cluster
    }

    function GetButtonLabel(props: Props) {
        console.log(props);
        return (
            <>
                { (() => {
                    if (props.cluster.state === "stopped") {
                        <p>Power on</p>
                    } else {
                        <p>Power off</p>
                    }
                })() }
            </>
        );
    }

    function UpdateClusterList() {
        React.useEffect(() => {
            const intervalId = setInterval(() => {
                api.getAllClusters().then((data) => {
                    let instances = data["instanceIds"];
                    let clusterList = [];
                    for (let i = 0; i < instances.length; ++i) {
                        clusterList.push({
                            id: instances[i]["InstanceId"],
                            state: instances[i]["State"]
                        });
                    }
                    setClusterList(clusterList);
                });
            }, 1000);
            return () => { clearInterval(intervalId); }
        });

        return (
            <ul className="cluster">
                {clusterList.map((cluster) => (
                    <li className="cluster-item">
                        <div className="cluster-item__name">
                            {cluster.id}
                        </div>
                        <div className="cluster-item__button">
                            <button onClick={handleClusterPowerButton} data-cluster-id={cluster.id}>
                                <GetButtonLabel cluster={cluster} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <>
            <button onClick={handleClusterListButton}>List Clusters</button>
            <UpdateClusterList />
        </>
    );
};
