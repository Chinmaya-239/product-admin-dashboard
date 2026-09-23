export default function EmptyState({
  title = "No products found",
  description = "Try a different search term or clear your filters.",
}) {
  return (
    <div className="text-center py-16 border border-dashed border-line rounded-xl">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
  );
}
