import {Cluster} from "../types/Cluster";
import * as api from "../apis/cluster";
import React, { Dispatch } from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

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

    function GetButton(props: Props) {
        if (props.cluster.state === "stopped") {
            return (
                <Button variant="outline-success" onClick={handleClusterPowerButton} data-cluster-id={props.cluster.id}>
                    Start
                </Button>
            );
        } else if (props.cluster.state === "running") {
            return (
                <Button variant="danger" onClick={handleClusterPowerButton} data-cluster-id={props.cluster.id}>
                    Stop
                </Button>
            );
        } else {
            return (
                <Button variant="secondary">...</Button>
            );
        }
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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Instance ID</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {clusterList.map((cluster) => (
                        <tr>
                            <td>{cluster.id}</td>
                            <td><GetButton cluster={cluster} /></td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        );
    }

    return (
        <>
            <Button onClick={handleClusterListButton}>List Clusters</Button>
            <UpdateClusterList />
        </>
    );
};
