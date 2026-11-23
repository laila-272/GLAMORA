import { useState } from "react";
import AccountLayout from "./AccountLayout";
import { useAccount } from "../../Context/AccountContext";

const OPTIONS = [
  {
    key: "arrivals",
    title: "New arrivals & collection edits",
    text: "Discover original imported perfumes from international brands.",
  },
  {
    key: "stories",
    title: "Scent stories & care notes",
    text: "Brand stories, scent guides and care advice for your original fragrances.",
  },
  {
    key: "offers",
    title: "Offers & shop updates",
    text: "Occasional news from GLAMORA.",
  },
];

export default function Preferences() {
  const { preferences, updatePreferences } = useAccount();
  const [draft, setDraft] = useState(preferences);
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [key]: !d[key] }));
  };
  const submit = (e) => {
    e.preventDefault();
    updatePreferences(draft);
    setSaved(true);
  };

  return (
    <AccountLayout
      current="prefs"
      title="Your account, your way."
      subtitle="Choose what reaches your inbox and keep your account in your hands."
    >
      <form onSubmit={submit} className="max-w-[760px]">
        <h2 className="font-serif text-[24px] font-medium leading-tight">
          Email preferences
        </h2>
        <p className="mt-2 text-[11px] text-[#6d656c]">
          New scents, fragrant stories and little rituals. Only the things you
          want to hear about.
        </p>

        <ul className="mt-5">
          {OPTIONS.map((o) => (
            <li key={o.key} className="border-b border-[#eae7e9] last:border-0">
              <label className="flex cursor-pointer items-start gap-3 py-4">
                <input
                  type="checkbox"
                  checked={!!draft[o.key]}
                  onChange={() => toggle(o.key)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#f72568]"
                />
                <span>
                  <span className="block text-[12px] font-medium">
                    {o.title}
                  </span>
                  <span className="mt-1.5 block text-[10px] text-[#6d656c]">
                    {o.text}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="mt-3 h-10 rounded-full bg-[#f72568] px-6 text-[12px] font-medium text-white"
        >
          Save preferences
        </button>
        <p
          role="status"
          className="mt-3 min-h-[16px] text-[11px] text-[#5b6a46]"
        >
          {saved && "Your preferences have been saved."}
        </p>
      </form>
    </AccountLayout>
  );
}
