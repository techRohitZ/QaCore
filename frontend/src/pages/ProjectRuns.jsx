import { useEffect ,useState } from "react";
import {useParams , useNavigate} from "react-router-dom";
import { getProjectRuns } from "../api/runs.api";

export default function ProjectRuns (){
    const {projectId} =useParams();
    const navigate = useNavigate();
    const [runs ,setRuns] =useState([]);
    const[ loading ,setLoading] =useState(true);
    const [error, setError] = useState("");

useEffect(()=>{
    async function fetchRuns() {
        try {
            const res = await getProjectRuns(projectId);
            setRuns(res.data.data);
        } catch {
            setError("Could not load test runs. Please refresh to try again.");
        } finally{
            setLoading(false);
        }

    }
    fetchRuns();
} ,[projectId]);

 if (error) return <p role="alert" className="p-6 text-red-300">{error}</p>;
 if (loading) return <div className="p-6">Loading runs...</div>;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6 text-slate-100">
      <h1 className="text-xl font-semibold">Test Runs</h1>

      <div className="overflow-x-auto"><table className="w-full text-sm border border-slate-800">
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
              tabIndex={0}
              onKeyDown={event => { if (event.key === "Enter") navigate(`/runs/${run._id}`); }}
              onClick={() => navigate(`/runs/${run._id}`)}
            >
              <td className="p-2">{run._id.slice(-6)}</td>
              <td>{run.status}</td>
              <td>{run.stats?.durationMs ?? "-"} ms</td>
              <td>{new Date(run.createdAt).toLocaleString()}</td>
              <td>{run.parentRun ? "Retry" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table></div>
      {!runs.length && <p className="text-slate-400">No runs yet. Run a suite from your project to see results here.</p>}
    </div>
  );
}
