export const addressLines = (a) => [
  a.name,
  [a.street, a.apartment].filter(Boolean).join(", "),
  `${a.area}, ${a.city}, ${a.country}`,
  a.phone,
];

export default function AddressCard({
  address: a,
  onEdit,
  onRemove,
  onMakeDefault,
}) {
  return (
    <article className="flex flex-col rounded-3xl bg-[#fff5f8] p-6">
      <h2 className="font-serif text-[20px] font-medium leading-tight">
        {a.label}
        {a.isDefault && (
          <span className="ml-2 font-sans text-[10px] text-[#e0556f]">
            ( Default )
          </span>
        )}
      </h2>
      <address className="mt-4 text-[12px] not-italic leading-[1.55] text-[#5a525a]">
        {addressLines(a).map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </address>
      <div className="mt-4 flex gap-4 text-[10px]">
        <button
          type="button"
          onClick={onEdit}
          className="text-[#5a525a] underline underline-offset-2"
        >
          Edit address
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-[#e0556f] underline underline-offset-2"
        >
          Remove
        </button>
      </div>
      {a.isDefault ? (
        <p className="mt-4 text-[10px] text-[#6d656c]">
          Default address · Used as your first delivery choice.
        </p>
      ) : (
        <button
          type="button"
          onClick={onMakeDefault}
          className="mt-4 h-9 self-start rounded-full border border-[#eae7e9] bg-white px-5 text-[11px] font-medium"
        >
          Make default
        </button>
      )}
    </article>
  );
}
