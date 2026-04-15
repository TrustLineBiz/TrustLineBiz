import PipelineBoard from '../components/pipeline/PipelineBoard';

export default function Pipeline() {
  return (
    <div className="flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Pipeline</h1>
      </div>
      <PipelineBoard />
    </div>
  );
}
