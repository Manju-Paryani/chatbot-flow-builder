import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FlowCanvas from './components/flowCanvas';

// App layout with two main parts: Sidebar (node palette) and FlowCanvas (the editor)
export default function App() {
  try {
    return (
      <div className="">
        <FlowCanvas />
        <ToastContainer position="bottom-right" />
      </div>
    );
  } catch (err) {
    console.error('Render error:', err);
    return <div>Error loading app.</div>;
  }
}
