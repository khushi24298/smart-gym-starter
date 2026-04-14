export default function StatusMessage({ type = 'info', children }) {
  if (!children) return null;

  return (
    <p className={`status-message ${type}`}>
      {children}
    </p>
  );
}
