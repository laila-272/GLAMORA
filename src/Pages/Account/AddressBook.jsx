import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import AddressCard from "./AddressCard";
import Modal from "./Modal";
import { useAccount } from "../../Context/AccountContext.jsx";

export default function AddressBook() {
  const navigate = useNavigate();
  const { addresses, removeAddress, makeDefault } = useAccount();
  const [removing, setRemoving] = useState(null); // address awaiting confirmation
  const sorted = [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );

  return (
    <AccountLayout
      current="addresses"
      title="Address book"
      subtitle="The places your everyday can find you."
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[12px] text-[#6d656c]">
          {addresses.length} saved{" "}
          {addresses.length === 1 ? "address" : "addresses"}
        </p>
        <button
          type="button"
          onClick={() => navigate("/account/addresses/new")}
          className="h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
        >
          Add an address
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-10 text-[13px] text-[#6d656c]">
          No saved addresses yet.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {sorted.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              onEdit={() => navigate(`/account/addresses/${a.id}/edit`)}
              onRemove={() => setRemoving(a)}
              onMakeDefault={() => makeDefault(a.id)}
            />
          ))}
        </div>
      )}

      {removing && (
        <Modal
          title="Remove this address?"
          onClose={() => setRemoving(null)}
          size="max-w-[420px]"
        >
          <p className="mt-4 text-[12px] leading-[1.5] text-[#4a424a]">
            The “{removing.label}” address will be removed from your address
            book.
            {removing.isDefault &&
              addresses.length > 1 &&
              " Another address will become your default."}
          </p>
          <div className="mt-6 flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                removeAddress(removing.id);
                setRemoving(null);
              }}
              className="h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setRemoving(null)}
              className="text-[12px] text-[#f72568]"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </AccountLayout>
  );
}
