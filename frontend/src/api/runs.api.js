import api from "./axios";

export const getProjectRuns =(projectId) =>{
    return api.get(`/projects/${projectId}/runs`);

};

export const getRunDetails  =(runId) =>{
    return api.get(`/runs/${runId}`);
};

export const rerunTest =(runId) =>{
    return api.post(`/runs/${runId}/rerun`);
};