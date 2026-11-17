"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/actions/user/updateProfile";

const initialState: ProfileState = { status: "idle" };

export default function ProfileCard({
  user,
}: {
  user: { userName: string; email: string };
}) {
  const t = useTranslations("profile");
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );
  const errors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="w-full flex justify-between border-b background-border pb-8 gap-8">
      <div className="w-[40%] flex flex-col gap-2">
        <h1 className="text-[#EAEAEA]">{t("account")}</h1>
        <p className="text-gray-400 text-sm tracking-wide">
          {t("accountDesc")}
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="userName" className="text-slate-400 text-sm">
            {t("displayName")}
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            defaultValue={user.userName}
            aria-invalid={!!errors?.userName}
            className="text-[#EAEAEA] border px-4 py-2 rounded-md background-elevated background-border outline-none focus:border-[#EAEAEA] transition"
          />
          {errors?.userName && (
            <p role="alert" className="text-red-400 text-sm">
              {errors.userName[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-slate-400 text-sm">
            {t("emailAddress")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            aria-invalid={!!errors?.email}
            className="text-[#EAEAEA] border px-4 py-2 rounded-md background-elevated background-border outline-none focus:border-[#EAEAEA] transition"
          />
          {errors?.email && (
            <p role="alert" className="text-red-400 text-sm">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div>
          <button
            className="font-medium tracking-wide border rounded-md bg-[#EAEAEA] px-4 py-2 cursor-pointer hover:opacity-90 transition"
            type="submit"
            disabled={pending}
          >
            {pending ? t("saving") : t("save")}
          </button>
        </div>
        {state.status === "success" && (
          <p className="primary-green text-center p-4" role="status">
            {t("saved")}
          </p>
        )}
        {state.status === "error" && state.message && (
          <p className="primary-red text-center p-4" role="alert">
            {t(state.message)}
          </p>
        )}
      </form>
    </div>
  );
}
