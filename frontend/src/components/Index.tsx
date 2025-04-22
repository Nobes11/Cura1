// Export all components from this index file
export { SuspenseWrapper } from './SuspenseWrapper';

// Re-export SuspenseWrapper directly for router access
import { SuspenseWrapper as SW } from './SuspenseWrapper';
const SuspenseWrapper = SW;
export default SuspenseWrapper;
