export default function ErrorState({
  message = "Something went wrong while loading products.",
  onRetry,
}) {
  return (
    <div className="text-center py-16 border border-line rounded-xl bg-danger-light">
      <p className="font-medium text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-lg bg-danger text-white text-sm font-medium px-4 py-2 hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
