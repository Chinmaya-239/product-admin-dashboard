export default function Loader({ label = "Loading products…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted">
      <div className="h-8 w-8 rounded-full border-2 border-line border-t-accent animate-spin mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
