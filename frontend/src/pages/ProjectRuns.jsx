import { useEffect ,useState } from "react";
import {useParams , useNavigate} from "react-router-dom";
import { getProjectRuns } from "../api/runs.api";

export default function ProjectRuns (){
    const {projectId} =useParams;
    const navigate = useNavigate();
    const [runs ,setRuns] =useState([]);
    const[ loading ,setLoading] =useState(true);

useEffect(()=>{
    async function fetchRuns() {
        try {
            const res = await getProjectRuns(projectId);
            setRuns(res.data);
        } finally{
            setLoading(false);
        }

    }
    fetchRuns();
} ,[projectId]);

 if (loading) return <div className="p-6">Loading runs...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Test Runs</h1>

      <table className="w-full text-sm border border-slate-800">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-2 text-left">Run ID</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Created</th>
            <th>Retry</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr
              key={run._id}
              className="border-t border-slate-800 hover:bg-slate-900 cursor-pointer"
              onClick={() => navigate(`/runs/${run._id}`)}
            >
              <td className="p-2">{run._id.slice(-6)}</td>
              <td>{run.status}</td>
              <td>{run.duration || "-"} ms</td>
              <td>{new Date(run.createdAt).toLocaleString()}</td>
              <td>{run.parentRun ? "Retry" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}